import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CandidateForm from './pages/CandidateForm';
import DebugList from './pages/DebugList';
import Health from './pages/Health';
import Login from './pages/Login';
import CandidateList from './pages/admin/CandidateList';
import CandidateCreate from './pages/admin/CandidateCreate';
import CandidateDetail from './pages/admin/CandidateDetail';
import Dashboard from './pages/admin/Dashboard';
import KanbanBoard from './pages/admin/KanbanBoard';
import WorkerList from './pages/admin/WorkerList';
import WorkerDetail from './pages/admin/WorkerDetail';
import WorkerCreate from './pages/admin/WorkerCreate';
import Settings from './pages/admin/Settings';
import JobList from './pages/admin/JobList';
import JobCreate from './pages/admin/JobCreate';
import JobDetail from './pages/admin/JobDetail';
import JobShortlist from './pages/admin/JobShortlist';
import Templates from './pages/admin/Templates';

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/candidatar" replace />} />

          {/* Public Routes */}
          <Route path="/candidatar" element={<CandidateForm />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/tablero" element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          } />

          <Route path="/admin/candidatos" element={
            <ProtectedRoute>
              <CandidateList />
            </ProtectedRoute>
          } />

          <Route path="/admin/candidatos/crear" element={
            <ProtectedRoute>
              <CandidateCreate />
            </ProtectedRoute>
          } />

          <Route path="/admin/candidatos/:id" element={
            <ProtectedRoute>
              <CandidateDetail />
            </ProtectedRoute>
          } />

          <Route path="/admin/trabajadores" element={
            <ProtectedRoute>
              <WorkerList />
            </ProtectedRoute>
          } />

          <Route path="/admin/trabajadores/crear" element={<WorkerCreate />} />
          <Route path="/admin/configuracion" element={<Settings />} />

          <Route path="/admin/trabajadores/:id" element={
            <ProtectedRoute>
              <WorkerDetail />
            </ProtectedRoute>
          } />

          {/* Job Routes */}
          <Route path="/admin/pedidos" element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          } />

          <Route path="/admin/pedidos/nuevo" element={
            <ProtectedRoute>
              <JobCreate />
            </ProtectedRoute>
          } />

          <Route path="/admin/pedidos/:id" element={
            <ProtectedRoute>
              <JobDetail />
            </ProtectedRoute>
          } />

          <Route path="/admin/pedidos/:id/shortlist" element={
            <ProtectedRoute>
              <JobShortlist />
            </ProtectedRoute>
          } />

          <Route path="/admin/templates" element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          } />

          {/* System Routes */}
          <Route path="/health" element={<Health />} />
          <Route path="/debug" element={<DebugList />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;