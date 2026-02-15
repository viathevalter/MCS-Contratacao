'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-4">
                <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
                    <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-14 md:h-24 w-auto" />
                    <div className="leading-tight pb-1 md:pb-3">
                        <div className="font-bold text-sm md:text-xl text-slate-900 tracking-tight whitespace-nowrap">Wolter's <span className="text-[#004F9F]">Contratação</span></div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                    <Link href="/#quem-somos" className="hover:text-[#004F9F] transition-colors">Quem Somos</Link>
                    <Link href="/#servicos" className="hover:text-[#004F9F] transition-colors">Serviços</Link>
                    <Link href="/#internacional" className="hover:text-[#004F9F] transition-colors">Internacional</Link>
                    <Link
                        href="/candidatar"
                        className="rounded-full bg-[#FF6B00] px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-[#e66000] hover:shadow-md"
                    >
                        Candidatar-se
                    </Link>
                </nav>

                {/* Mobile WhatsApp Button */}
                <a
                    href="https://wa.me/351931753270"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:hidden flex items-center gap-2 text-[#25D366] font-semibold hover:opacity-80 transition-opacity"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 2.023.888 3.15.888 3.182 0 5.768-2.587 5.769-5.767.001-3.181-2.584-5.768-5.765-5.768zm3.394 8.167c-.145.405-.837.77-1.172.824-.299.045-1.771.777-4.075-1.434-.485-.465-1.263-1.219-1.263-2.327 0-1.087.576-1.637.781-1.859.176-.192.373-.242.495-.242.122 0 .244.004.349.048.118.049.52.285.795.836.23.46.257.545.195.669-.061.123-.095.199-.186.299-.091.1-.192.223-.27.301-.082.083-.169.173.078.601.246.427 1.341 1.94 2.859 2.656.402.19.702.323 1.05.426.313.092.839.066 1.189-.136.417-.238.643-1.009.643-1.009zM12 2C6.48 2 2 6.48 2 12c0 1.92.534 3.73 1.468 5.312L2 22l4.825-1.27A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                    <span>WhatsApp</span>
                </a>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-4 text-base font-medium text-slate-600">
                        <Link href="/#quem-somos" onClick={() => setIsMenuOpen(false)} className="hover:text-[#004F9F] py-2 border-b border-slate-50">Quem Somos</Link>
                        <Link href="/#servicos" onClick={() => setIsMenuOpen(false)} className="hover:text-[#004F9F] py-2 border-b border-slate-50">Serviços</Link>
                        <Link href="/#internacional" onClick={() => setIsMenuOpen(false)} className="hover:text-[#004F9F] py-2 border-b border-slate-50">Internacional</Link>
                        <Link
                            href="/candidatar"
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-2 text-center rounded-xl bg-[#FF6B00] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#e66000]"
                        >
                            Candidatar-se
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
