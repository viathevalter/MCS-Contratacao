import Link from "next/link";

export default function Page() {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://mcs-contratacao.vercel.app";

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder - User to provide image */}
            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-xl">
              W
            </div>
            <div className="leading-tight">
              <div className="font-bold text-xl text-slate-900 tracking-tight">Wolter's <span className="text-blue-600">Contratação</span></div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#quem-somos" className="hover:text-blue-600 transition-colors">Quem Somos</a>
            <a href="#servicos" className="hover:text-blue-600 transition-colors">Serviços</a>
            <a href="#internacional" className="hover:text-blue-600 transition-colors">Internacional</a>
            <Link
              href="/candidatar"
              className="rounded-full bg-[#FF6B00] px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-[#e66000] hover:shadow-md"
            >
              Candidatar-se
            </Link>
          </nav>

          {/* Mobile Menu Button - Placeholder */}
          <button className="md:hidden p-2 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004F9F] to-[#003366] py-20 text-white md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl text-white drop-shadow-sm">
            NINGUÉM TE CONECTA COM TALENTO INDUSTRIAL COMO NÓS
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 md:text-xl leading-relaxed">
            Na Wolter’s Contratação, somos especializados no recrutamento e fornecimento de mão de obra qualificada, conectando empresas com profissionais capacitados para projetos industriais.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/candidatar"
              className="w-full rounded-full bg-[#FF6B00] px-8 py-4 text-center font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#e66000] sm:w-auto"
            >
              Encontrar Oportunidades
            </Link>
            <a
              href="#quem-somos"
              className="w-full rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              Saiba Mais
            </a>
          </div>
        </div>
      </section>

      {/* Quem Somos - About Section */}
      <section id="quem-somos" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-xl md:h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80"
                alt="Equipe Wolters"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Sobre Nós
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                QUEM SOMOS?
              </h2>
              <div className="mt-6 space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  A <span className="font-semibold text-blue-700">Wolter’s Contratação</span> é uma empresa especializada na contratação e fornecimento de mão de obra qualificada, oferecendo soluções eficientes e confiáveis para diferentes setores.
                </p>
                <p>
                  Nosso foco é conectar empresas a profissionais capacitados, garantindo qualidade, compromisso e cumprimento em cada projeto. Nosso objetivo é apoiar o crescimento de nossos clientes por meio de um serviço ágil, responsável e adaptado às suas necessidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços - Industrial Sectors */}
      <section id="servicos" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Setores de Atuação</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Recrutamos especialistas para os setores mais exigentes da indústria.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Soldagem",
                desc: "TIG, MIG/MAG, Eletrodo, Orbital e Arco Submerso – SAW",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                )
              },
              {
                title: "Caldeiraria",
                desc: "Tubulações industriais e estruturas complexas",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                )
              },
              {
                title: "Fabricação e Montagem",
                desc: "Estruturas metálicas de grande porte",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                )
              },
              {
                title: "Mecânica Industrial",
                desc: "Manutenção e montagem de equipamentos",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )
              },
              {
                title: "Pintura e Polimento",
                desc: "Acabamento industrial e proteção de superfícies",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a16.084 16.084 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                )
              }
            ].map((service, i) => (
              <div key={i} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internacional */}
      <section id="internacional" className="relative bg-[#0c4a6e] py-20 text-white">
        <div className="absolute inset-0 bg-blue-900/50" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Alcance Internacional</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Na Wolter’s Contratação, operamos a nível internacional, oferecendo recrutamento e fornecimento de mão de obra qualificada para projetos industriais em:
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {["Espanha", "Bélgica", "Itália"].map((country) => (
              <div key={country} className="rounded-full bg-white/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm border border-white/20">
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer className="bg-slate-900 py-16 text-slate-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white">W</div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href="tel:+351931753270" className="hover:text-white transition-colors">+351 931 753 270</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.632 9-8.242 0-4.61-4.03-8.242-9-8.242-4.97 0-9 3.632-9 8.242 0 4.61 4.03 8.242 9 8.242Z" />
                  </svg>
                  <span>@wolterscontratista</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#quem-somos" className="hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href="#servicos" className="hover:text-white transition-colors">Serviços</a></li>
                <li><Link href={`${adminUrl}/#/candidatar`} className="hover:text-white transition-colors">Candidatar-se</Link></li>
                <li><Link href={`${adminUrl}/#/login`} className="hover:text-white transition-colors">Portal do Cliente</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Wolter's Contratação. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}