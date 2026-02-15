import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col 
        transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="h-24 flex items-center px-6 bg-slate-950 font-bold text-white tracking-wider justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <img src="/logowolters.svg" alt="Wolters Admin" className="h-16 w-auto" />
            <span>WOLTERS ADMIN</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <Link
            to="/admin"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === '/admin' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/admin/candidatos"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/candidatos') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Candidatos
          </Link>

          <Link
            to="/admin/tablero"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/tablero') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Tablero
          </Link>

          <Link
            to="/admin/trabajadores"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/trabajadores') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Trabajadores
          </Link>

          <Link
            to="/admin/pedidos"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/pedidos') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Pedidos / Match
          </Link>

          <Link
            to="/admin/templates"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/templates') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Plantillas
          </Link>

          <Link
            to="/admin/configuracion"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive('/admin/configuracion') ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 uppercase font-semibold mb-2">Sistema</div>
          <Link to="/candidatar" target="_blank" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver Formulario Público
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex justify-between items-center px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800">Portal de Candidatos</h2>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                <p className="text-xs text-brand-600 capitalize">Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-slate-100"
              title="Salir"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
