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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
            {/* Logo */}
            <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-14 md:h-24 w-auto" />
            <div className="leading-tight pb-1 md:pb-3">
              <div className="font-bold text-base md:text-xl text-slate-900 tracking-tight whitespace-nowrap">Wolter's <span className="text-[#004F9F]">Contratação</span></div>
            </div>
          </Link>

          {/* Simple Nav for Admin View */}
          {/* Contact Info - Visible on all devices */}
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {/* Link to WhatsApp */}
            <a
              href="https://wa.me/351931753270"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-5 md:h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3zM12 5.5a1 1 0 011 1v.758a5.5 5.5 0 010 9.484V17.5a1 1 0 11-2 0v-.758a5.5 5.5 0 010-9.484V6.5a1 1 0 011-1z" clipRule="evenodd" />
                {/* Wait, the above path is generic. Let's use the PROPER WhatsApp Path */}
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 2.023.888 3.15.888 3.182 0 5.768-2.587 5.769-5.767.001-3.181-2.584-5.768-5.765-5.768zm3.394 8.167c-.145.405-.837.77-1.172.824-.299.045-1.771.777-4.075-1.434-.485-.465-1.263-1.219-1.263-2.327 0-1.087.576-1.637.781-1.859.176-.192.373-.242.495-.242.122 0 .244.004.349.048.118.049.52.285.795.836.23.46.257.545.195.669-.061.123-.095.199-.186.299-.091.1-.192.223-.27.301-.082.083-.169.173.078.601.246.427 1.341 1.94 2.859 2.656.402.19.702.323 1.05.426.313.092.839.066 1.189-.136.417-.238.643-1.009.643-1.009zM12 2C6.48 2 2 6.48 2 12c0 1.92.534 3.73 1.468 5.312L2 22l4.825-1.27A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              <span className="hidden md:inline text-[#004F9F]">+351 931 753 270</span>
            </a>
          </nav>
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
                <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-20 w-auto" />
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#004F9F]">
                    <path d="M12.004 2C6.479 2 2 6.479 2 12c0 2.164.701 4.195 1.9 5.892L2.7 22l4.223-1.168C8.58 21.666 10.25 22 12.004 22c5.525 0 10.004-4.479 10.004-10S17.525 2 12.004 2zM12 18.5c-1.28 0-2.502-.349-3.565-1.01l-.255-.16-2.65.73.705-2.58-.168-.266A8.502 8.502 0 0 1 3.5 12C3.5 7.309 7.31 3.5 12 3.5c4.69 0 8.5 3.809 8.5 8.5S16.69 18.5 12 18.5z" />
                    <path d="M16.92 14.86c-.27-.135-1.6-.79-1.845-.88-.245-.09-.425-.135-.605.135-.18.27-.7 1.155-.86 1.35-.16.195-.32.22-.59.085-.27-.135-1.14-.54-2.17-1.46-.8-.715-1.34-1.6-1.5-1.87-.16-.27-.015-.42.12-.555.12-.12.27-.315.405-.475.135-.16.18-.27.27-.45.09-.18.045-.34-.025-.475-.07-.135-.605-1.46-.83-1.995-.22-.53-.445-.455-.605-.465-.15-.01-.32-.01-.49-.01-.17 0-.445.065-.68.32-.235.255-.9.88-.9 2.145s.92 2.485 1.05 2.675c.125.19 1.8 2.765 4.365 3.875 1.575.68 2.195.68 2.945.57.825-.12 1.6-.65 1.825-1.28.225-.63.225-1.17.16-1.28-.065-.11-.235-.19-.505-.325z" />
                  </svg>
                  <a href="https://wa.me/351931753270" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+351 931 753 270</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#004F9F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.632 9-8.242 0-4.61-4.03-8.242-9-8.242-4.97 0-9 3.632-9 8.242 0 4.61 4.03 8.242 9 8.242Z" />
                  </svg>
                  <span>@wolterscontratista</span>
                </li>
              </ul>
            </div>

            {/* Links Rápidos Removed */}
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