interface SettingsTabProps {
  killSwitch: boolean;
  autoStart: boolean;
  notifications: boolean;
  onToggleKillSwitch: () => void;
  onToggleAutoStart: () => void;
  onToggleNotifications: () => void;
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer"
      style={{
        background: enabled ? 'var(--neon)' : 'var(--navy-border)',
        boxShadow: enabled ? '0 0 12px var(--neon-glow)' : 'none',
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
        style={{ left: enabled ? '22px' : '2px', background: enabled ? 'var(--navy-deep)' : 'var(--text-soft)' }}
      />
    </button>
  );
}

export default function SettingsTab({
  killSwitch,
  autoStart,
  notifications,
  onToggleKillSwitch,
  onToggleAutoStart,
  onToggleNotifications,
}: SettingsTabProps) {
  return (
    <div className="flex flex-col px-6 pt-8 pb-6 gap-4 max-w-sm mx-auto w-full animate-fade-up">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Настройки</h2>

      {/* Security */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Безопасность</div>
        <div className="vpn-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--navy-border)' }}>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Kill Switch</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Блокирует интернет при разрыве VPN</div>
            </div>
            <Toggle enabled={killSwitch} onToggle={onToggleKillSwitch} />
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

      {/* Notifications */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Уведомления</div>
        <div className="vpn-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Push-уведомления</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Статус подключения и угрозы</div>
            </div>
            <Toggle enabled={notifications} onToggle={onToggleNotifications} />
          </div>
        </div>
      </div>

      {/* Startup */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-soft)' }}>Запуск</div>
        <div className="vpn-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Автозапуск VPN</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>Подключаться при старте системы</div>
            </div>
            <Toggle enabled={autoStart} onToggle={onToggleAutoStart} />
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="vpn-card px-4 py-4 flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--text-soft)' }}>Версия приложения</span>
        <span className="text-sm font-mono" style={{ color: 'var(--text-bright)' }}>v2.4.1</span>
      </div>
    </div>
  );
}
