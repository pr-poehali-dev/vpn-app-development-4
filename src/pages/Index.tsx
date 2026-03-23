import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

type Tab = 'connect' | 'profile' | 'settings';
type ConnectionState = 'disconnected' | 'connecting' | 'connected';
type IconName = string;

const SERVERS = [
  { id: 1, name: 'Нидерланды — Амстердам', flag: '🇳🇱', ping: 22, load: 34 },
  { id: 2, name: 'Германия — Франкфурт', flag: '🇩🇪', ping: 18, load: 51 },
  { id: 3, name: 'США — Нью-Йорк', flag: '🇺🇸', ping: 89, load: 67 },
  { id: 4, name: 'Япония — Токио', flag: '🇯🇵', ping: 142, load: 29 },
  { id: 5, name: 'Великобритания — Лондон', flag: '🇬🇧', ping: 31, load: 44 },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>('connect');
  const [connState, setConnState] = useState<ConnectionState>('disconnected');
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [showServers, setShowServers] = useState(false);
  const [ip, setIp] = useState('195.82.14.73');
  const [killSwitch, setKillSwitch] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (connState === 'connected') {
      timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(timer);
  }, [connState]);

  const handleConnect = () => {
    if (connState === 'connected') {
      setConnState('disconnected');
      setIp('195.82.14.73');
      return;
    }
    if (connState === 'disconnected') {
      setConnState('connecting');
      setTimeout(() => {
        setConnState('connected');
        setIp('185.220.101.45');
      }, 2200);
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const btnClass =
    connState === 'connected'
      ? 'btn-connect-active'
      : connState === 'connecting'
      ? 'btn-connect-connecting'
      : 'btn-connect-inactive';

  return (
    <div
      className="min-h-screen flex flex-col font-ibm select-none"
      style={{ background: 'var(--navy-deep)' }}
    >
      <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />

      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--navy-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--neon-dim)', border: '1px solid var(--neon)' }}
          >
            <Icon name="Shield" size={14} style={{ color: 'var(--neon)' }} />
          </div>
          <span className="font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--text-bright)' }}>
            SecureVPN
          </span>
        </div>
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{ background: 'var(--navy-card)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.25)' }}
        >
          PRO
        </span>
      </header>

      <main className="relative z-10 flex-1 overflow-auto">

        {/* ── CONNECT TAB ── */}
        {tab === 'connect' && (
          <div className="flex flex-col items-center px-6 pt-8 pb-6 gap-6 animate-fade-up">

            <div
              className="w-full max-w-sm flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{
                background: connState === 'connected' ? 'rgba(0,230,118,0.07)' : 'rgba(255,68,68,0.07)',
                border: `1px solid ${connState === 'connected' ? 'rgba(0,230,118,0.25)' : 'rgba(255,68,68,0.2)'}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${connState === 'connecting' ? 'dot-blink' : ''}`}
                  style={{
                    background: connState === 'connected' ? 'var(--green-safe)' : connState === 'connecting' ? 'var(--neon)' : 'var(--red-unsafe)',
                    boxShadow: connState === 'connected' ? '0 0 8px rgba(0,230,118,0.6)' : connState === 'connecting' ? '0 0 8px var(--neon-glow)' : '0 0 8px rgba(255,68,68,0.5)',
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: connState === 'connected' ? 'var(--green-safe)' : connState === 'connecting' ? 'var(--neon)' : 'var(--red-unsafe)',
                  }}
                >
                  {connState === 'connected' ? 'Защищено' : connState === 'connecting' ? 'Подключение...' : 'Не защищено'}
                </span>
              </div>
              {connState === 'connected' && (
                <span className="text-xs font-mono" style={{ color: 'var(--text-soft)' }}>
                  {formatTime(sessionTime)}
                </span>
              )}
            </div>

            {/* CONNECT BUTTON */}
            <div className="relative flex items-center justify-center my-4">
              <div
                className="absolute rounded-full"
                style={{
                  width: 220,
                  height: 220,
                  border: `1px solid ${connState === 'connected' ? 'rgba(0,212,255,0.2)' : 'rgba(255,68,68,0.15)'}`,
                  transition: 'border-color 0.6s ease',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 196,
                  height: 196,
                  border: `1px dashed ${connState === 'connected' ? 'rgba(0,212,255,0.15)' : 'rgba(255,68,68,0.1)'}`,
                  animation: connState === 'connecting' ? 'spin-ring 3s linear infinite' : 'none',
                  transition: 'border-color 0.6s ease',
                }}
              />
              <button
                onClick={handleConnect}
                className={`relative rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-500 cursor-pointer active:scale-95 ${btnClass}`}
                style={{
                  width: 168,
                  height: 168,
                  background: connState === 'connected'
                    ? 'linear-gradient(145deg, #0d2040, #0a1628)'
                    : connState === 'connecting'
                    ? 'linear-gradient(145deg, #0d1a30, #080e1c)'
                    : 'linear-gradient(145deg, #1a0d0d, #130808)',
                  border: `2px solid ${connState === 'connected' ? 'var(--neon)' : connState === 'connecting' ? 'rgba(0,212,255,0.5)' : 'rgba(255,68,68,0.6)'}`,
                  transition: 'all 0.6s ease',
                }}
              >
                <Icon
                  name={connState === 'connecting' ? 'Loader' : 'Power'}
                  size={40}
                  style={{
                    color: connState === 'connected' ? 'var(--neon)' : connState === 'connecting' ? 'var(--neon)' : 'var(--red-unsafe)',
                    animation: connState === 'connecting' ? 'spin-ring 1.2s linear infinite' : 'none',
                    transition: 'color 0.4s ease',
                  }}
                />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{
                    color: connState === 'connected' ? 'var(--neon)' : connState === 'connecting' ? 'rgba(0,212,255,0.7)' : 'rgba(255,68,68,0.8)',
                    letterSpacing: '0.2em',
                  }}
                >
                  {connState === 'connected' ? 'Вкл' : connState === 'connecting' ? '...' : 'Выкл'}
                </span>
              </button>
            </div>

            {/* Server selector */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => setShowServers(!showServers)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 hover:opacity-90"
                style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{selectedServer.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                      {selectedServer.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-soft)' }}>
                      {selectedServer.ping} мс · Нагрузка {selectedServer.load}%
                    </div>
                  </div>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  style={{
                    color: 'var(--text-soft)',
                    transform: showServers ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {showServers && (
                <div
                  className="mt-2 rounded-2xl overflow-hidden animate-fade-up"
                  style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
                >
                  {SERVERS.map((server, idx) => (
                    <button
                      key={server.id}
                      onClick={() => { setSelectedServer(server); setShowServers(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-white/5"
                      style={{
                        borderBottom: idx < SERVERS.length - 1 ? '1px solid var(--navy-border)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{server.flag}</span>
                        <div className="text-left">
                          <div className="text-sm" style={{ color: server.id === selectedServer.id ? 'var(--neon)' : 'var(--text-bright)' }}>
                            {server.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-soft)' }}>{server.ping} мс</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--navy-border)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${server.load}%`,
                              background: server.load > 70 ? 'var(--red-unsafe)' : server.load > 45 ? '#ffa500' : 'var(--green-safe)',
                            }}
                          />
                        </div>
                        {server.id === selectedServer.id && (
                          <Icon name="Check" size={14} style={{ color: 'var(--neon)' }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* IP + Protocol */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-3">
              <div className="vpn-card px-4 py-3 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>Ваш IP</span>
                <span className="text-sm font-mono font-medium" style={{ color: connState === 'connected' ? 'var(--neon)' : 'var(--text-bright)' }}>
                  {ip}
                </span>
              </div>
              <div className="vpn-card px-4 py-3 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>Протокол</span>
                <span className="text-sm font-mono font-medium" style={{ color: 'var(--text-bright)' }}>WireGuard</span>
              </div>
            </div>

            {connState === 'connected' && (
              <div
                className="w-full max-w-sm flex items-center justify-between px-4 py-3 rounded-2xl animate-fade-up"
                style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
              >
                <div className="flex items-center gap-2">
                  <Icon name="ArrowDown" size={14} style={{ color: 'var(--green-safe)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    Скачано: <span style={{ color: 'var(--text-bright)' }}>2.4 МБ</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="ArrowUp" size={14} style={{ color: 'var(--neon)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    Отдано: <span style={{ color: 'var(--text-bright)' }}>0.8 МБ</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="flex flex-col px-6 pt-8 pb-6 gap-4 max-w-sm mx-auto w-full animate-fade-up">
            <div className="flex items-center gap-4 mb-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'var(--neon-dim)', border: '1px solid rgba(0,212,255,0.3)' }}
              >
                👤
              </div>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-bright)' }}>user@example.com</div>
                <div className="text-sm" style={{ color: 'var(--text-soft)' }}>ID: #48291</div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0.03) 100%)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={15} style={{ color: 'var(--neon)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--neon)' }}>PRO подписка</span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,230,118,0.15)', color: 'var(--green-safe)', border: '1px solid rgba(0,230,118,0.3)' }}
                >
                  Активна
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs mb-0.5" style={{ color: 'var(--text-soft)' }}>Действует до</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>15 марта 2027</div>
                </div>
                <div>
                  <div className="text-xs mb-0.5" style={{ color: 'var(--text-soft)' }}>Устройств</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>5 / 10</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-soft)' }}>
                  <span>До окончания</span>
                  <span>357 дней</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--navy-border)' }}>
                  <div className="h-full rounded-full" style={{ width: '98%', background: 'linear-gradient(90deg, var(--neon), rgba(0,212,255,0.5))' }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Стран', value: '50+', icon: 'Globe' },
                { label: 'Серверов', value: '200+', icon: 'Server' },
                { label: 'Дней', value: '357', icon: 'Calendar' },
              ].map(item => (
                <div key={item.label} className="vpn-card px-3 py-3 flex flex-col items-center gap-1">
                  <Icon name={item.icon as IconName} size={16} style={{ color: 'var(--neon)' }} />
                  <span className="text-base font-bold" style={{ color: 'var(--text-bright)' }}>{item.value}</span>
                  <span className="text-xs" style={{ color: 'var(--text-soft)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="vpn-card overflow-hidden">
              {[
                { label: 'Сменить пароль', icon: 'Lock' },
                { label: 'Управление устройствами', icon: 'Smartphone' },
                { label: 'История платежей', icon: 'Receipt' },
                { label: 'Выйти', icon: 'LogOut', danger: true },
              ].map((item, idx, arr) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-white/5"
                  style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--navy-border)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={item.icon as IconName} size={16} style={{ color: item.danger ? 'var(--red-unsafe)' : 'var(--text-soft)' }} />
                    <span className="text-sm" style={{ color: item.danger ? 'var(--red-unsafe)' : 'var(--text-bright)' }}>
                      {item.label}
                    </span>
                  </div>
                  {!item.danger && <Icon name="ChevronRight" size={14} style={{ color: 'var(--text-soft)' }} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div className="flex flex-col px-6 pt-8 pb-6 gap-4 max-w-sm mx-auto w-full animate-fade-up">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Настройки</h2>

            <div>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Безопасность</div>
              <div className="vpn-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--navy-border)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Kill Switch</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Блокирует интернет при разрыве VPN</div>
                  </div>
                  <button
                    onClick={() => setKillSwitch(!killSwitch)}
                    className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      background: killSwitch ? 'var(--neon)' : 'var(--navy-border)',
                      boxShadow: killSwitch ? '0 0 12px var(--neon-glow)' : 'none',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                      style={{ left: killSwitch ? '22px' : '2px', background: killSwitch ? 'var(--navy-deep)' : 'var(--text-soft)' }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Протокол</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Выбор туннеля</div>
                  </div>
                  <div
                    className="text-sm font-mono px-3 py-1 rounded-lg"
                    style={{ background: 'var(--neon-dim)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.2)' }}
                  >
                    WireGuard
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Уведомления</div>
              <div className="vpn-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Push-уведомления</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Статус подключения и угрозы</div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      background: notifications ? 'var(--neon)' : 'var(--navy-border)',
                      boxShadow: notifications ? '0 0 12px var(--neon-glow)' : 'none',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                      style={{ left: notifications ? '22px' : '2px', background: notifications ? 'var(--navy-deep)' : 'var(--text-soft)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Запуск</div>
              <div className="vpn-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Автозапуск VPN</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Подключаться при старте системы</div>
                  </div>
                  <button
                    onClick={() => setAutoStart(!autoStart)}
                    className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      background: autoStart ? 'var(--neon)' : 'var(--navy-border)',
                      boxShadow: autoStart ? '0 0 12px var(--neon-glow)' : 'none',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                      style={{ left: autoStart ? '22px' : '2px', background: autoStart ? 'var(--navy-deep)' : 'var(--text-soft)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="vpn-card px-4 py-4 flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-soft)' }}>Версия приложения</span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-bright)' }}>v2.4.1</span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav
        className="relative z-10 flex items-center justify-around px-4 py-3"
        style={{
          background: 'rgba(13, 21, 38, 0.95)',
          borderTop: '1px solid var(--navy-border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {([
          { id: 'connect', icon: 'Power', label: 'VPN' },
          { id: 'profile', icon: 'User', label: 'Профиль' },
          { id: 'settings', icon: 'Settings', label: 'Настройки' },
        ] as { id: Tab; icon: string; label: string }[]).map(item => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all duration-200"
              style={{ minWidth: 64 }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: active ? 'var(--neon-dim)' : 'transparent',
                  boxShadow: active ? '0 0 10px var(--neon-glow)' : 'none',
                }}
              >
                <Icon
                  name={item.icon as IconName}
                  size={18}
                  style={{ color: active ? 'var(--neon)' : 'var(--text-soft)', transition: 'color 0.2s' }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: active ? 'var(--neon)' : 'var(--text-soft)', transition: 'color 0.2s' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}