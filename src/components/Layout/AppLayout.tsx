import { memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patients',
};

const AppLayout = memo(() => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      <Sidebar />
      <div className="flex-1 ml-52 flex flex-col min-h-screen">
        <Topbar title={TITLES[pathname] ?? 'HealthOS'} />
        <main className="flex-1 pt-12 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';
export default AppLayout;
