import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ErpProvider, useErp } from '@/lib/erpContext';
import { ThemeProvider } from '@/lib/themeContext';
import { ToastProvider } from '@/lib/toastContext';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import AuthPage from '@/pages/AuthPage';
import RegisterTenant from '@/pages/RegisterTenant';
import Dashboard from '@/pages/Dashboard';
import CRM from '@/pages/CRM';
import Sales from '@/pages/Sales';
import Inventory from '@/pages/Inventory';
import Purchase from '@/pages/Purchase';
import UsersPage from '@/pages/UsersPage';
import AISuite from '@/pages/AISuite';
import Subscription from '@/pages/Subscription';

const defaultRouteFor = (hasPermission) => {
  if (hasPermission('dashboard')) return '/';
  if (hasPermission('sales')) return '/sales';
  if (hasPermission('purchase')) return '/purchase';
  if (hasPermission('inventory')) return '/inventory';
  if (hasPermission('crm')) return '/crm';
  if (hasPermission('users')) return '/users';
  if (hasPermission('ai')) return '/ai';
  if (hasPermission('subscription')) return '/subscription';
  return '/home';
};

function ProtectedRoute({ module, children }) {
  const { hasPermission, currentUser } = useErp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!hasPermission(module)) return <Navigate to={defaultRouteFor(hasPermission)} replace />;
  return children;
}

function CatchAll() {
  const { currentUser, hasPermission } = useErp();
  return <Navigate to={currentUser ? defaultRouteFor(hasPermission) : '/home'} replace />;
}

function ErpApp() {
  return <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<RegisterTenant />} />
    <Route element={<AppLayout />}>
      <Route path="/" element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
      <Route path="/crm" element={<ProtectedRoute module="crm"><CRM /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute module="sales"><Sales /></ProtectedRoute>} />
      <Route path="/quotations" element={<Navigate to="/sales" replace />} />
      <Route path="/invoices" element={<Navigate to="/sales" replace />} />
      <Route path="/inventory" element={<ProtectedRoute module="inventory"><Inventory /></ProtectedRoute>} />
      <Route path="/purchase" element={<ProtectedRoute module="purchase"><Purchase /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute module="users"><UsersPage /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute module="ai"><AISuite /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute module="subscription"><Subscription /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<CatchAll />} />
  </Routes>;
}

export default function App() {
  return <ThemeProvider><ToastProvider><ErpProvider><Router><ErpApp /></Router></ErpProvider></ToastProvider></ThemeProvider>;
}
