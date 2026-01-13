import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { GoalsPage } from './features/goals/GoalsPage';
import { TransactionEntryPage } from './features/transactions/TransactionEntryPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { ReportPage } from './features/report/ReportPage';

import { ProfilePage } from './features/profile/ProfilePage';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useEffect, useState } from 'react';
import { AuthPage } from './features/auth/AuthPage';
import { AccountsPage } from './features/accounts/AccountsPage';
import { DebtsPage } from './features/debts/DebtsPage';
import { SocialPage } from './features/social/SocialPage';
import { HealthAssessmentPage } from './features/dashboard/HealthAssessmentPage';
import { Toaster } from 'sonner';

import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Simulating initial app state loading
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <AuthPage />;
  }

  return (
    <NotificationProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/debts" element={<DebtsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/add" element={<TransactionEntryPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/health-assessment" element={<HealthAssessmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </NotificationProvider>
  );
}
