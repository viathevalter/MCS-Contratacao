import { useTranslations } from 'next-intl';
import { Link } from '../../navigation';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function Page() {
  const t = useTranslations('Index');
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://mcs-contratacao.vercel.app";

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004F9F] to-[#003366] py-20 text-white md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl text-white drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 md:text-xl leading-relaxed">
            {t('subtitle')}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
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

      <Footer />
    </main>
  );
}