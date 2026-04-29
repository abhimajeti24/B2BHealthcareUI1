import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthListener } from './hooks/useAuthListener';
import { useRealTimeNotifications } from './hooks/useRealTimeNotifications';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Lazy-loaded route modules (micro-SPA boundary pattern — each module bundles independently)
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage'));
const PatientDetailsPage = lazy(() => import('./pages/PatientDetails/PatientDetailsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[300px]">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

function AppRoutes() {
  const { user } = useAuthStore();
  useRealTimeNotifications(!!user);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/patients" element={<PatientDetailsPage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  useAuthListener();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
