import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', Icon: BarChart3 },
  { to: '/patients', label: 'Patients', Icon: Users },
];

const Sidebar = memo(() => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handle = async () => { await logout(); navigate('/login'); };

  return (
    <aside className="fixed inset-y-0 left-0 w-52 bg-zinc-950 flex flex-col z-30">
      {/* Brand */}
      <div className="h-12 flex items-center px-5 border-b border-zinc-800">
        <span className="text-white font-semibold tracking-tight">HealthOS</span>
        <span className="ml-2 text-zinc-600 text-xs">Pro</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded text-[13px] transition-colors ${
                isActive
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={14} className={isActive ? 'text-zinc-300' : 'text-zinc-600'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
        <div className="px-2.5 py-2">
          <p className="text-[12px] text-zinc-400 truncate">
            {user?.displayName ?? user?.email?.split('@')[0]}
          </p>
          <p className="text-[11px] text-zinc-600 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handle}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 w-full transition-colors"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
