import React, { useState, useEffect } from 'react';
import { useRequests } from '../hooks/useRequests';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { ClientDashboard } from '../pages/client/ClientDashboard';
import { CreateRequest } from '../pages/client/CreateRequest';
import { ClientRequestDetails } from '../pages/client/RequestDetails';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AtRiskRequests } from '../pages/admin/AtRiskRequests';
import { AdminRequestDetails } from '../pages/admin/RequestDetails';
import { SLAPolicies } from '../pages/admin/SLAPolicies';
import { BillingBoard } from '../pages/admin/BillingBoard';
import { AnalyticsStudio } from '../pages/admin/AnalyticsStudio';
import { ServiceRequest } from '../types/request';

export function AppRoutes() {
  const { requests } = useRequests();
  const { user, login } = useAuth();
  
  // Track current route via hash
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Synchronize hash with window history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRequest = (req: ServiceRequest) => {
    setSelectedRequest(req);
    if (user?.role === 'CLIENT') {
      navigate(`/client/requests/${req.id}`);
    } else {
      navigate(`/admin/requests/${req.id}`);
    }
  };

  const handleLandingRoleLaunch = async (role: 'ADMIN' | 'CLIENT') => {
    if (role === 'ADMIN') {
      await login('sarah.connor@enterprise.io');
      navigate('/admin');
    } else {
      await login('alex.morgan@fintechcorp.com');
      navigate('/client');
    }
  };

  // Find request for detail views
  const activeDetailRequest =
    selectedRequest ||
    requests.find(r => currentPath.includes(r.id)) ||
    requests[0];

  // Public Routes
  if (currentPath === '/') {
    return <LandingPage onNavigate={navigate} onSwitchRole={handleLandingRoleLaunch} />;
  }

  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentPath === '/403' || currentPath === '/forbidden') {
    return <ForbiddenPage attemptedPath={currentPath} onNavigate={navigate} />;
  }

  return (
    <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
      
      {/* Client Portal Routes (Guarded: Client, Admin, Agent) */}
      {currentPath === '/client' && (
        <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <ClientDashboard onNavigate={navigate} onSelectRequest={handleSelectRequest} />
        </ProtectedRoute>
      )}

      {currentPath === '/client/create' && (
        <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <CreateRequest onNavigate={navigate} onSelectRequest={handleSelectRequest} />
        </ProtectedRoute>
      )}

      {currentPath.startsWith('/client/requests/') && (
        <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <ClientRequestDetails request={activeDetailRequest} onNavigate={navigate} />
        </ProtectedRoute>
      )}

      {/* Admin Operations Routes (Guarded: Admin & Agent ONLY) */}
      {currentPath === '/admin' && (
        <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <AdminDashboard onNavigate={navigate} onSelectRequest={handleSelectRequest} />
        </ProtectedRoute>
      )}

      {currentPath === '/admin/at-risk' && (
        <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <AtRiskRequests onNavigate={navigate} onSelectRequest={handleSelectRequest} />
        </ProtectedRoute>
      )}

      {currentPath === '/admin/billing' && (
        <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <BillingBoard />
        </ProtectedRoute>
      )}

      {currentPath === '/admin/analytics' && (
        <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <AnalyticsStudio />
        </ProtectedRoute>
      )}

      {currentPath.startsWith('/admin/requests/') && (
        <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentPath={currentPath} onNavigate={navigate}>
          <AdminRequestDetails request={activeDetailRequest} onNavigate={navigate} />
        </ProtectedRoute>
      )}

      {currentPath === '/admin/sla-policies' && (
        <ProtectedRoute allowedRoles={['ADMIN']} currentPath={currentPath} onNavigate={navigate}>
          <SLAPolicies onNavigate={navigate} />
        </ProtectedRoute>
      )}

    </DashboardLayout>
  );
}
