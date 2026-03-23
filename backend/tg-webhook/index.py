"""
Webhook для Telegram-бота. Принимает сообщения от пользователей,
генерирует одноразовый код авторизации и отправляет его в чат.
"""
import json
import os
import random
import string
from datetime import datetime, timedelta
import psycopg2
import urllib.request


def send_message(chat_id: int, text: str):
    token = os.environ['TELEGRAM_BOT_TOKEN']
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({"chat_id": chat_id, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req)


def generate_code() -> str:
    return ''.join(random.choices(string.digits, k=6))


def handler(event: dict, context) -> dict:
    headers = {'Access-Control-Allow-Origin': '*'}

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    message = body.get('message') or body.get('edited_message')

    if not message:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    chat_id = message['chat']['id']
    telegram_id = message['from']['id']
    first_name = message['from'].get('first_name', '')
    last_name = message['from'].get('last_name', '')
    username = message['from'].get('username', '')
    text = message.get('text', '').strip()

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'], options=f"-c search_path={schema}")
    cur = conn.cursor()

    # Upsert user
    cur.execute("""
        INSERT INTO users (telegram_id, telegram_username, first_name, last_name)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (telegram_id) DO UPDATE
        SET telegram_username = EXCLUDED.telegram_username,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name
    """, (telegram_id, username, first_name, last_name))

    if text in ('/start', '/code', '/login'):
        code = generate_code()
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        # Invalidate old codes
        cur.execute("UPDATE auth_codes SET used = TRUE WHERE telegram_id = %s AND used = FALSE", (telegram_id,))

        cur.execute("""
            INSERT INTO auth_codes (telegram_id, code, expires_at)
            VALUES (%s, %s, %s)
        """, (telegram_id, code, expires_at))

        conn.commit()
        cur.close()
        conn.close()

        send_message(chat_id, (
            f"🔐 <b>Ваш код для входа:</b>\n\n"
            f"<code>{code}</code>\n\n"
            f"Код действителен <b>5 минут</b>.\n"
            f"Введите его на сайте для авторизации."
        ))
    else:
        conn.commit()
        cur.close()
        conn.close()

        send_message(chat_id, "Отправьте /code чтобы получить код для входа.")

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}