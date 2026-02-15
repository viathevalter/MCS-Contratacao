import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  // Use environment variable for Landing URL, defaulting to production
  const landingUrl = import.meta.env.VITE_LANDING_URL || "https://mcs-contratacao.vercel.app";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header - Matches Landing Page */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            {/* Logo */}
            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#004F9F] to-[#003366] text-white flex items-center justify-center font-bold text-xl shadow-sm">
              W
            </div>
            <div className="leading-tight">
              <div className="font-bold text-xl text-slate-900 tracking-tight">Wolter's <span className="text-[#004F9F]">Contratação</span></div>
            </div>
          </Link>

          {/* Simple Nav for Admin View */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {/* Links pointing back to the Landing Page */}
            <a href={`${landingUrl}/#quem-somos`} className="hover:text-[#004F9F] transition-colors">Quem Somos</a>
            <a href={`${landingUrl}/#servicos`} className="hover:text-[#004F9F] transition-colors">Serviços</a>
            <a href={`${landingUrl}/#internacional`} className="hover:text-[#004F9F] transition-colors">Internacional</a>
            <div className="h-4 w-px bg-slate-300 mx-2"></div>
            {/* Link to Admin Home/Dashboard if needed */}
            <Link to="/" className="text-[#004F9F] font-semibold">Portal do Candidato</Link>
          </nav>

          {/* Mobile Menu Placeholder - kept simple for now */}
          <button className="md:hidden p-2 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer - Matches Landing Page */}
      <footer className="bg-slate-900 py-16 text-slate-300 mt-auto">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-[#004F9F] to-[#003366] flex items-center justify-center font-bold text-white">W</div>
                <span className="text-2xl font-bold text-white">Wolter's Contratação</span>
              </div>
              <p className="max-w-md text-slate-400">
                Sua parceira estratégica em recrutamento industrial. Conectamos talento e oportunidade em toda a Europa.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#004F9F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href="tel:+351931753270" className="hover:text-white transition-colors">+351 931 753 270</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#004F9F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.632 9-8.242 0-4.61-4.03-8.242-9-8.242-4.97 0-9 3.632-9 8.242 0 4.61 4.03 8.242 9 8.242Z" />
                  </svg>
                  <span>@wolterscontratista</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href={`${landingUrl}/#quem-somos`} className="hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href={`${landingUrl}/#servicos`} className="hover:text-white transition-colors">Serviços</a></li>
                <li><a href={`${landingUrl}/candidatar`} className="hover:text-white transition-colors">Candidatar-se</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal do Cliente</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            &copy; {currentYear} Wolter's Contratação. Todos os direitos reservados.
            <div className="mt-2 text-xs opacity-50">
              <Link to="/admin/candidatos" className="hover:text-slate-300">Admin</Link> | <Link to="/debug">Debug</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;