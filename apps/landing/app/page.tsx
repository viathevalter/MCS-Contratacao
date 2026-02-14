import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900" />
            <div className="leading-tight">
              <div className="font-semibold">WOLTERS</div>
              <div className="text-xs text-slate-500">UE Recruitment</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#vacantes" className="hover:underline">Vacantes</a>
            <a href="#proceso" className="hover:underline">Proceso</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <Link
              href="https://mcs-contratacao.vercel.app/#/candidatar"
              className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:opacity-90"
            >
              Postular ahora
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Oportunidades en España y Unión Europea
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Contratación técnica para industria:
              <span className="text-slate-600"> soldadores, tuberos, mecánicos y más</span>.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Completa tu solicitud online. Nuestro equipo revisa tu perfil y te contacta por WhatsApp para los próximos pasos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://mcs-contratacao.vercel.app/#/candidatar"
                className="rounded-xl bg-slate-900 px-6 py-3 text-center text-white hover:opacity-90"
              >
                Enviar solicitud
              </Link>
              <a
                href="#proceso"
                className="rounded-xl border px-6 py-3 text-center hover:bg-slate-50"
              >
                Ver proceso
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-600 sm:grid-cols-4">
              <div className="rounded-xl border p-3">
                <div className="font-semibold text-slate-900">+EU</div>
                <div>Proyectos activos</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="font-semibold text-slate-900">WhatsApp</div>
                <div>Contacto rápido</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="font-semibold text-slate-900">Documentación</div>
                <div>Validación</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="font-semibold text-slate-900">Transparencia</div>
                <div>Seguimiento</div>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="rounded-2xl border bg-slate-50 p-6">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold">Postulación en 3 minutos</div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
                <li>Datos personales</li>
                <li>Perfil profesional</li>
                <li>Adjuntar CV / certificados</li>
              </ol>
              <Link
                href="https://mcs-contratacao.vercel.app/#/candidatar"
                className="mt-5 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white hover:opacity-90"
              >
                Ir al formulario
              </Link>
              <p className="mt-3 text-xs text-slate-500">
                *Si tu CV está en foto, asegúrate de que sea nítida y legible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vacantes */}
      <section id="vacantes" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-semibold">Vacantes frecuentes</h2>
          <p className="mt-2 text-slate-600">
            Selecciona tu área al postular. Si no aparece, marca “Otro”.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Soldador MIG/MAG (GMAW/FCAW)",
              "Soldador TIG (GTAW)",
              "Tubero",
              "Mecánico montador",
              "Electricista",
              "Pintor industrial",
              "Montador de estructura",
              "Calderero/Armador",
              "Operador CNC/Tornero CNC",
            ].map((item) => (
              <div key={item} className="rounded-xl border p-4">
                <div className="font-medium">{item}</div>
                <div className="mt-1 text-sm text-slate-600">
                  Proyectos industriales — España / UE
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-semibold">Proceso</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Recepción", "Entras en nuestra bandeja de candidatos."],
              ["2", "Revisión", "Validamos profesión, experiencia y documentos."],
              ["3", "Contacto", "WhatsApp / llamada para confirmar datos."],
              ["4", "Próximos pasos", "Prueba técnica / propuesta según pedido."],
            ].map(([n, title, desc]) => (
              <div key={n} className="rounded-xl border bg-white p-5">
                <div className="text-sm font-semibold text-slate-500">{n}</div>
                <div className="mt-1 font-semibold">{title}</div>
                <div className="mt-2 text-sm text-slate-600">{desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="https://mcs-contratacao.vercel.app/#/candidatar"
              className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-white hover:opacity-90"
            >
              Enviar solicitud
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <div className="font-semibold">¿Cuándo me contactan?</div>
              <div className="mt-2 text-sm text-slate-600">
                Cuando haya match con un pedido o para completar datos. La mayoría de contactos es por WhatsApp.
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <div className="font-semibold">¿Qué documentos necesito?</div>
              <div className="mt-2 text-sm text-slate-600">
                Depende del país. En la solicitud seleccionas tu documentación y adjuntas CV/certificados.
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <div className="font-semibold">¿Puedo postular sin email?</div>
              <div className="mt-2 text-sm text-slate-600">
                Sí. Email es opcional. El teléfono/WhatsApp es obligatorio.
              </div>
            </div>
            <div className="rounded-xl border p-5">
              <div className="font-semibold">Ya postulé, ¿y ahora?</div>
              <div className="mt-2 text-sm text-slate-600">
                Tu perfil queda registrado y se analiza. Si hay vacante compatible, te contactamos.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Wolters Recruitment.</div>
          <div className="flex gap-4">
            <Link href="https://mcs-contratacao.vercel.app/#/candidatar" className="hover:underline">
              Postular
            </Link>
            <a href="#faq" className="hover:underline">FAQ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}