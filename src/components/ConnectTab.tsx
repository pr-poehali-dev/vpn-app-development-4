import Icon from '@/components/ui/icon';

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

interface Server {
  id: number;
  name: string;
  flag: string;
  ping: number;
  load: number;
}

interface ConnectTabProps {
  connState: ConnectionState;
  selectedServer: Server;
  showServers: boolean;
  ip: string;
  sessionTime: number;
  servers: Server[];
  onConnect: () => void;
  onToggleServers: () => void;
  onSelectServer: (server: Server) => void;
  formatTime: (s: number) => string;
}

export default function ConnectTab({
  connState,
  selectedServer,
  showServers,
  ip,
  sessionTime,
  servers,
  onConnect,
  onToggleServers,
  onSelectServer,
  formatTime,
}: ConnectTabProps) {
  const btnClass =
    connState === 'connected'
      ? 'btn-connect-active'
      : connState === 'connecting'
      ? 'btn-connect-connecting'
      : 'btn-connect-inactive';

  return (
    <div className="flex flex-col items-center px-6 pt-8 pb-6 gap-6 animate-fade-up">

      {/* Status banner */}
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
          onClick={onConnect}
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
          onClick={onToggleServers}
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
            {servers.map((server, idx) => (
              <button
                key={server.id}
                onClick={() => onSelectServer(server)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-white/5"
                style={{
                  borderBottom: idx < servers.length - 1 ? '1px solid var(--navy-border)' : 'none',
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

      {/* Traffic stats */}
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
  );
}
