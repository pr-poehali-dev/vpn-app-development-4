import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConnectTab from '@/components/ConnectTab';
import ProfileTab from '@/components/ProfileTab';
import SettingsTab from '@/components/SettingsTab';

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
        {tab === 'connect' && (
          <ConnectTab
            connState={connState}
            selectedServer={selectedServer}
            showServers={showServers}
            ip={ip}
            sessionTime={sessionTime}
            servers={SERVERS}
            onConnect={handleConnect}
            onToggleServers={() => setShowServers(!showServers)}
            onSelectServer={(server) => { setSelectedServer(server); setShowServers(false); }}
            formatTime={formatTime}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab />
        )}
        {tab === 'settings' && (
          <SettingsTab
            killSwitch={killSwitch}
            autoStart={autoStart}
            notifications={notifications}
            onToggleKillSwitch={() => setKillSwitch(!killSwitch)}
            onToggleAutoStart={() => setAutoStart(!autoStart)}
            onToggleNotifications={() => setNotifications(!notifications)}
          />
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
