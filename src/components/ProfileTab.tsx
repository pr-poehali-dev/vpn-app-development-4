import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/c8c6f107-6f3d-486b-883a-d2e614d0c6eb';

type IconName = string;

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username: string;
  telegram_id?: number;
}

interface ProfileTabProps {
  user: User;
  onLogout: () => void;
}

export default function ProfileTab({ user, onLogout }: ProfileTabProps) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const displayName = fullName || (user.username ? `@${user.username}` : 'Пользователь');
  const subLabel = user.username ? `@${user.username}` : `ID: #${user.id}`;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) return;
    fetch(`${AUTH_URL}?action=avatar`, { headers: { 'X-Session-Token': token } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.avatar_url) setAvatarUrl(data.avatar_url); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 gap-4 max-w-sm mx-auto w-full animate-fade-up">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'var(--neon-dim)', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            : '👤'
          }
        </div>
        <div>
          <div className="font-semibold" style={{ color: 'var(--text-bright)' }}>{displayName}</div>
          <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{subLabel}</div>
        </div>
      </div>

      {/* Subscription */}
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

      {/* Stats */}
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

      {/* Actions */}
      <div className="vpn-card overflow-hidden">
        {[
          { label: 'Управление устройствами', icon: 'Smartphone', action: undefined },
          { label: 'История платежей', icon: 'Receipt', action: undefined },
          { label: 'Выйти', icon: 'LogOut', danger: true, action: onLogout },
        ].map((item, idx, arr) => (
          <button
            key={item.label}
            onClick={item.action}
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
  );
}