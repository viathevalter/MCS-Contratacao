import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  FileText,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Kanban
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/candidatos', icon: Users, label: 'Candidatos' },
    { path: '/admin/tablero', icon: Kanban, label: 'Tablero' },
    { path: '/admin/trabajadores', icon: Briefcase, label: 'Trabajadores' },
    { path: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos / Match' },
    { path: '/admin/templates', icon: FileText, label: 'Plantillas' },
    { path: '/admin/configuracion', icon: Settings, label: 'Configuración' },
  ];

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
        fixed inset-y-0 left-0 z-30 bg-slate-900 text-slate-300 flex flex-col 
        transition-all duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Sidebar Header */}
        <div className={`
          h-16 flex items-center bg-slate-950 font-bold text-white tracking-wider 
          ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'}
          relative
        `}>
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/logowolters.svg" alt="Wolters Admin" className="h-10 w-auto" />
            {!isCollapsed && <span className="whitespace-nowrap">WOLTERS ADMIN</span>}
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white absolute right-4"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Toggle Button (Desktop only) */}
        <div className="hidden md:flex justify-end p-2 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expandir menú" : "Contraer menú"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                  ${active ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Link */}
        <div className="p-4 border-t border-slate-800">
          {!isCollapsed && <div className="text-xs text-slate-500 uppercase font-semibold mb-2">Sistema</div>}
          <a
            href="https://wolterscontratacao.com/candidatar"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center text-sm text-slate-400 hover:text-white transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? "Ver Formulario Público" : ""}
          >
            <ExternalLink size={16} className={isCollapsed ? '' : 'mr-2'} />
            {!isCollapsed && <span>Ver Formulario Público</span>}
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex justify-between items-center px-4 md:px-4 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1"
            >
              <Menu className="w-6 h-6" />
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
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-4 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

// Helper component for X icon if not imported from lucide-react (it is named X in lucide)
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
