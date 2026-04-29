import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import BottomNavBar from './components/layout/BottomNavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarePlan from './pages/CarePlan';
import Medications from './pages/Medications';
import WarningSignsPage from './pages/WarningSignsPage';
import Resources from './pages/Resources';
import Appointments from './pages/Appointments';
import ComingUp from './pages/ComingUp';
import Settings from './pages/Settings';

function AppRoutes() {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/care-plan" element={<CarePlan />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/warnings" element={<WarningSignsPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/coming-up" element={<ComingUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNavBar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
