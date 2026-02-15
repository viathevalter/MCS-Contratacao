import Link from "next/link";

export function Footer() {
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
                            Sua parceira estratégica em recrutamento industrial. Conectamos talento e oportunidade em toda a Europa.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Contato</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#004F9F] mt-0.5 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <a href="tel:+351931753270" className="hover:text-white transition-colors text-lg font-medium">+351 931 753 270</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#004F9F] flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.632 9-8.242 0-4.61-4.03-8.242-9-8.242-4.97 0-9 3.632-9 8.242 0 4.61 4.03 8.242 9 8.242Z" />
                                </svg>
                                <span className="text-lg">@wolterscontratista</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 text-lg">Links Rápidos</h3>
                        <ul className="space-y-3 text-base">
                            <li><Link href="/#quem-somos" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Quem Somos</Link></li>
                            <li><Link href="/#servicos" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Serviços</Link></li>
                            <li><Link href="/candidatar" className="hover:text-white transition-colors hover:translate-x-1 inline-block font-medium text-[#FF6B00]">Candidatar-se</Link></li>
                            <li><a href={`${adminUrl}/login`} className="hover:text-white transition-colors hover:translate-x-1 inline-block opacity-80 hover:opacity-100">Portal do Cliente</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    &copy; {currentYear} Wolter's Contratação. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
