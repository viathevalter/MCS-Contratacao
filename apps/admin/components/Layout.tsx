import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder */}
            <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#004F9F] to-[#003366] text-white flex items-center justify-center font-bold text-lg">
              W
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg text-slate-900 tracking-tight">Wolter's <span className="text-[#004F9F]">Contratação</span></div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Portal de Candidatos</div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-200 text-slate-500 py-6 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Wolters Recruitment.</p>
          <div className="mt-2 space-x-4">
            <Link to="/admin/candidatos" className="hover:text-slate-800 transition-colors">Admin Panel</Link>
            <span className="text-slate-300">|</span>
            <Link to="/debug" className="hover:text-slate-800 transition-colors">Debug Mode</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;