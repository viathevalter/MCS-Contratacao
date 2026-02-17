'use client';

import React, { useState } from 'react';
import { Link } from '../navigation';
import LanguageSelector from './LanguageSelector';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-4">
                <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
                    <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-14 md:h-24 w-auto" />
                    <div className="leading-tight pb-1 md:pb-3">
                        <div className="font-bold text-base md:text-xl text-slate-900 tracking-tight whitespace-nowrap">Wolter's <span className="text-[#004F9F]">Contratação</span></div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                    <Link href="/#quem-somos" className="hover:text-[#004F9F] transition-colors">Quem Somos</Link>
                    <Link href="/#servicos" className="hover:text-[#004F9F] transition-colors">Serviços</Link>
                    <Link href="/#internacional" className="hover:text-[#004F9F] transition-colors">Internacional</Link>
                    <LanguageSelector />
                    <Link
                        href="/candidatar"
                        className="rounded-full bg-[#FF6B00] px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-[#e66000] hover:shadow-md"
                    >
                        Candidatar-se
                    </Link>
                </nav>

                {/* Mobile WhatsApp Button & Menu Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <LanguageSelector />
                    <div className="flex items-center gap-1">
                        <a
                            href="https://www.instagram.com/wolterscontratista"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E1306C] hover:opacity-80 transition-opacity p-1.5"
                            aria-label="Instagram"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.facebook.com/people/Wolters-Contratista"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1877F2] hover:opacity-80 transition-opacity p-1.5"
                            aria-label="Facebook"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.648 0-2.928 1.67-2.928 3.403v1.518h3.945l-.597 3.667h-3.348v7.98h-4.887Z" />
                            </svg>
                        </a>
                    </div>
                    <a
                        href="https://wa.me/351931753270"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[#25D366] hover:opacity-80 transition-opacity p-2"
                        aria-label="WhatsApp"
                    >
                        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                            <path d="M12.004 2C6.479 2 2 6.479 2 12c0 2.164.701 4.195 1.9 5.892L2.7 22l4.223-1.168C8.58 21.666 10.25 22 12.004 22c5.525 0 10.004-4.479 10.004-10S17.525 2 12.004 2zM12 18.5c-1.28 0-2.502-.349-3.565-1.01l-.255-.16-2.65.73.705-2.58-.168-.266A8.502 8.502 0 0 1 3.5 12C3.5 7.309 7.31 3.5 12 3.5c4.69 0 8.5 3.809 8.5 8.5S16.69 18.5 12 18.5z" />
                            <path d="M16.92 14.86c-.27-.135-1.6-.79-1.845-.88-.245-.09-.425-.135-.605.135-.18.27-.7 1.155-.86 1.35-.16.195-.32.22-.59.085-.27-.135-1.14-.54-2.17-1.46-.8-.715-1.34-1.6-1.5-1.87-.16-.27-.015-.42.12-.555.12-.12.27-.315.405-.475.135-.16.18-.27.27-.45.09-.18.045-.34-.025-.475-.07-.135-.605-1.46-.83-1.995-.22-.53-.445-.455-.605-.465-.15-.01-.32-.01-.49-.01-.17 0-.445.065-.68.32-.235.255-.9.88-.9 2.145s.92 2.485 1.05 2.675c.125.19 1.8 2.765 4.365 3.875 1.575.68 2.195.68 2.945.57.825-.12 1.6-.65 1.825-1.28.225-.63.225-1.17.16-1.28-.065-.11-.235-.19-.505-.325z" />
                        </svg>
                    </a>
                </div>
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
