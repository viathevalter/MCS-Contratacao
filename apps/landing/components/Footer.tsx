import { Link } from "../navigation";

import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://mcs-contratacao.vercel.app";

    return (
        <footer id="contato" className="bg-slate-900 py-16 text-slate-300">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logowolters.svg" alt="Wolter's Contratação" className="h-20 w-auto" />
                            <span className="text-2xl font-bold text-white leading-none">Wolter's Contratação</span>
                        </div>
                        <p className="max-w-md text-slate-400 leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">{t('contact.title')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#004F9F] mt-0.5 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <a href="tel:+351931753270" className="hover:text-white transition-colors text-lg font-medium">+351 931 753 270</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-[#004F9F] flex-shrink-0">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                                </svg>
                                <a href="https://www.instagram.com/wolterscontratista?igsh=a212b2dudW5kam9m" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-lg">@wolterscontratista</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-[#004F9F] flex-shrink-0">
                                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.648 0-2.928 1.67-2.928 3.403v1.518h3.945l-.597 3.667h-3.348v7.98h-4.887Z" />
                                </svg>
                                <a href="https://www.facebook.com/people/Wolters-Contratista" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-lg">Wolter's Contratista</a>
                            </li>
                        </ul>
                    </div>


                </div>
                <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    &copy; {currentYear} Wolter's Contratação. {t('rights')}
                </div>
            </div>
        </footer>
    );
}
