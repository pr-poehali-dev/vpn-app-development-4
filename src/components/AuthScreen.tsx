import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/c8c6f107-6f3d-486b-883a-d2e614d0c6eb';

interface User {
  id: number;
  first_name: string;
  username: string;
}

interface AuthScreenProps {
  onAuth: (token: string, user: User) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<'start' | 'code'>('start');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const botUsername = 'securevpn_auth_bot';

  const handleOpenBot = () => {
    window.open(`https://t.me/${botUsername}?start=login`, '_blank');
    setStep('code');
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${AUTH_URL}?action=verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка проверки кода');
        return;
      }
      localStorage.setItem('session_token', data.token);
      onAuth(data.token, data.user);
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 font-ibm"
      style={{ background: 'var(--navy-deep)' }}
    >
      <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--neon-dim)',
              border: '1px solid var(--neon)',
              boxShadow: '0 0 30px var(--neon-glow)',
            }}
          >
            <Icon name="Shield" size={32} style={{ color: 'var(--neon)' }} />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold tracking-widest uppercase" style={{ color: 'var(--text-bright)' }}>
              HunVPN
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>
              Безопасное подключение
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="vpn-card w-full p-6 flex flex-col gap-5">
          {step === 'start' ? (
            <>
              <div className="text-center">
                <div className="text-base font-semibold mb-1" style={{ color: 'var(--text-bright)' }}>
                  Войти через Telegram
                </div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  Откройте бота, отправьте команду /code и введите полученный код
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--text-soft)' }}>
                {[
                  { n: 1, text: 'Откройте Telegram-бота' },
                  { n: 2, text: 'Получите одноразовый код' },
                  { n: 3, text: 'Введите код на этом экране' },
                ].map(item => (
                  <div key={item.n} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--neon-dim)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.3)' }}
                    >
                      {item.n}
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOpenBot}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--neon) 0%, rgba(0,212,255,0.7) 100%)',
                  color: 'var(--navy-deep)',
                  boxShadow: '0 0 20px var(--neon-glow)',
                }}
              >
                <Icon name="Send" size={16} style={{ color: 'var(--navy-deep)' }} />
                Открыть бота
              </button>

              <button
                onClick={() => setStep('code')}
                className="text-sm text-center transition-colors"
                style={{ color: 'var(--text-soft)' }}
              >
                Уже есть код → ввести
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-base font-semibold mb-1" style={{ color: 'var(--text-bright)' }}>
                  Введите код из бота
                </div>
                <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                  Код действителен 5 минут
                </div>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                placeholder="000000"
                className="w-full text-center text-3xl font-mono tracking-widest py-4 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--navy-deep)',
                  border: `1px solid ${error ? 'var(--red-unsafe)' : code.length === 6 ? 'var(--neon)' : 'var(--navy-border)'}`,
                  color: 'var(--text-bright)',
                  letterSpacing: '0.4em',
                }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
              />

              {error && (
                <div className="text-sm text-center" style={{ color: 'var(--red-unsafe)' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: code.length === 6 && !loading
                    ? 'linear-gradient(135deg, var(--neon) 0%, rgba(0,212,255,0.7) 100%)'
                    : 'var(--navy-border)',
                  color: code.length === 6 && !loading ? 'var(--navy-deep)' : 'var(--text-soft)',
                  boxShadow: code.length === 6 && !loading ? '0 0 20px var(--neon-glow)' : 'none',
                  cursor: code.length !== 6 || loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <Icon name="Loader" size={16} className="animate-spin" style={{ color: 'inherit' }} />
                ) : (
                  <Icon name="LogIn" size={16} style={{ color: 'inherit' }} />
                )}
                {loading ? 'Проверяю...' : 'Войти'}
              </button>

              <button
                onClick={() => { setStep('start'); setCode(''); setError(''); }}
                className="text-sm text-center"
                style={{ color: 'var(--text-soft)' }}
              >
                ← Назад
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}