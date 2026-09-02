import React, { useState, useEffect } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DispatchPlanningPage } from './pages/DispatchPlanningPage';
import { PendingPIPage } from './pages/PendingPIPage';
import { TodaysPlanningPage } from './pages/TodaysPlanningPage';
import { UpcomingPlanningPage } from './pages/UpcomingPlanningPage';
import { CompletedDispatchPage } from './pages/CompletedDispatchPage';
import { DispatchHistoryPage } from './pages/DispatchHistoryPage';
import { RollbackPage } from './pages/RollbackPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    const path = window.location.pathname;
    return path === '/' ? '/dashboard' : path;
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      } else {
        const path = window.location.pathname;
        setCurrentPath(path === '/' ? '/dashboard' : path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
  };

  const renderPage = (helpers: {
    openNewDispatch: (preSelectedPIId?: string) => void;
    openNewPI: () => void;
    openGatePass: (dsp: any) => void;
    openRollback: (dsp: any) => void;
    openPIDetails: (pi: any) => void;
  }) => {
    switch (currentPath) {
      case '/':
      case '/dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onOpenNewDispatch={helpers.openNewDispatch}
            onOpenGatePass={helpers.openGatePass}
            onOpenRollback={helpers.openRollback}
            onOpenPIDetails={helpers.openPIDetails}
            onOpenNewPI={helpers.openNewPI}
          />
        );

      case '/dispatch-planning':
        return (
          <DispatchPlanningPage
            onNavigate={handleNavigate}
            onOpenPIDetails={helpers.openPIDetails}
            onOpenNewPI={helpers.openNewPI}
          />
        );

      case '/pending-pi':
        return (
          <PendingPIPage
            onOpenPIDetails={helpers.openPIDetails}
            onOpenNewPI={helpers.openNewPI}
            onOpenNewDispatch={helpers.openNewDispatch}
          />
        );

      case '/todays-planning':
        return (
          <TodaysPlanningPage
            onOpenNewDispatch={helpers.openNewDispatch}
            onOpenGatePass={helpers.openGatePass}
            onOpenRollback={helpers.openRollback}
            onOpenPIDetails={helpers.openPIDetails}
          />
        );

      case '/upcoming-planning':
        return (
          <UpcomingPlanningPage
            onOpenNewDispatch={helpers.openNewDispatch}
            onOpenGatePass={helpers.openGatePass}
            onOpenPIDetails={helpers.openPIDetails}
          />
        );

      case '/completed-dispatch':
        return <CompletedDispatchPage />;

      case '/dispatch-history':
        return (
          <DispatchHistoryPage
            onOpenGatePass={helpers.openGatePass}
            onOpenPIDetails={helpers.openPIDetails}
          />
        );

      case '/rollback':
        return (
          <RollbackPage
            onOpenRollback={helpers.openRollback}
            onNavigate={handleNavigate}
          />
        );

      case '/reports':
        return <ReportsPage />;

      case '/settings':
        return <SettingsPage />;

      default:
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onOpenNewDispatch={helpers.openNewDispatch}
            onOpenGatePass={helpers.openGatePass}
            onOpenRollback={helpers.openRollback}
            onOpenPIDetails={helpers.openPIDetails}
            onOpenNewPI={helpers.openNewPI}
          />
        );
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={handleNavigate}>
      {(helpers) => renderPage(helpers)}
    </AppLayout>
  );
}
