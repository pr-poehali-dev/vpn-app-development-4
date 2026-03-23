"""
Авторизация пользователей: проверка кода из Telegram-бота,
создание сессии и получение данных текущего пользователя.
"""
import json
import os
import secrets
import urllib.request
from datetime import datetime, timedelta
import psycopg2


def get_conn():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'], options=f"-c search_path={schema}")
    cur = conn.cursor()
    return conn, cur


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    # POST ?action=verify — проверить код и получить токен сессии
    if method == 'POST' and action == 'verify':
        body = json.loads(event.get('body') or '{}')
        code = str(body.get('code', '')).strip()

        if not code or len(code) != 6:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный формат кода'})}

        conn, cur = get_conn()

        cur.execute("""
            SELECT ac.telegram_id, u.id, u.first_name, u.telegram_username
            FROM auth_codes ac
            JOIN users u ON u.telegram_id = ac.telegram_id
            WHERE ac.code = %s AND ac.used = FALSE AND ac.expires_at > NOW()
            ORDER BY ac.created_at DESC
            LIMIT 1
        """, (code,))

        row = cur.fetchone()

        if not row:
            cur.close()
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Код неверный или истёк'})}

        telegram_id, user_id, first_name, username = row

        # Mark code as used
        cur.execute("UPDATE auth_codes SET used = TRUE WHERE code = %s", (code,))

        # Update last login
        cur.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (user_id,))

        # Create session
        token = secrets.token_hex(32)
        expires_at = datetime.utcnow() + timedelta(days=30)
        cur.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)", (token, user_id, expires_at))

        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user_id,
                    'first_name': first_name or '',
                    'username': username or '',
                }
            })
        }

    # GET ?action=me — получить текущего пользователя по токену
    if method == 'GET' and action == 'me':
        token = event.get('headers', {}).get('X-Session-Token', '')

        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет токена'})}

        conn, cur = get_conn()

        cur.execute("""
            SELECT u.id, u.first_name, u.last_name, u.telegram_username, u.telegram_id
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            LIMIT 1
        """, (token,))

        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}

        user_id, first_name, last_name, username, telegram_id = row

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'id': user_id,
                'first_name': first_name or '',
                'last_name': last_name or '',
                'username': username or '',
                'telegram_id': telegram_id,
            })
        }

    # GET ?action=avatar — получить URL аватара пользователя из Telegram
    if method == 'GET' and action == 'avatar':
        token = event.get('headers', {}).get('X-Session-Token', '')
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Нет токена'})}

        conn, cur = get_conn()
        cur.execute("""
            SELECT u.telegram_id FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            LIMIT 1
        """, (token,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}

        telegram_id = row[0]
        bot_token = os.environ['TELEGRAM_BOT_TOKEN']

        # Получаем фото профиля
        photos_url = f"https://api.telegram.org/bot{bot_token}/getUserProfilePhotos?user_id={telegram_id}&limit=1"
        with urllib.request.urlopen(photos_url) as r:
            photos_data = json.loads(r.read())

        avatar_url = None
        if photos_data.get('ok') and photos_data['result']['total_count'] > 0:
            file_id = photos_data['result']['photos'][0][-1]['file_id']

            file_url = f"https://api.telegram.org/bot{bot_token}/getFile?file_id={file_id}"
            with urllib.request.urlopen(file_url) as r:
                file_data = json.loads(r.read())

            if file_data.get('ok'):
                file_path = file_data['result']['file_path']
                avatar_url = f"https://api.telegram.org/file/bot{bot_token}/{file_path}"

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'avatar_url': avatar_url})
        }

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}