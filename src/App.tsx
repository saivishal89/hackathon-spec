import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { RequestsProvider } from './hooks/useRequests';
import { ToastProvider } from './components/ui/Toast';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </RequestsProvider>
    </AuthProvider>
  );
}

export default App;
