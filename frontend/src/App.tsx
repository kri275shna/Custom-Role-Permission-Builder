import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { SidebarLayout } from './layouts/SidebarLayout';
import { Dashboard } from './pages/Dashboard';
import { RoleManagement } from './pages/RoleManagement';
import { UserManagement } from './pages/UserManagement';
import { EffectiveViewer } from './pages/EffectiveViewer';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activePage } = useApp();

  switch (activePage) {
    case 'dashboard':
      return <Dashboard />;
    case 'roles':
      return <RoleManagement />;
    case 'users':
      return <UserManagement />;
    case 'effective-viewer':
      return <EffectiveViewer />;
    default:
      return <Dashboard />;
  }
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <SidebarLayout>
        <MainContent />
      </SidebarLayout>
      <ToastContainer />
    </AppProvider>
  );
};

export default App;
