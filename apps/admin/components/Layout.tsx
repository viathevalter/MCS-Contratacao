import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-brand-900 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tight">WOLTERS</div>
          <div className="text-sm opacity-80">UE Recruitment</div>
        </div>
      </header>
      
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-8">
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