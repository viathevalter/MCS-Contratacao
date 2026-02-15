'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-10 w-auto" />
                    </Link>
                </div>

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

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
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
