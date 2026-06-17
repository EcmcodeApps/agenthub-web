import Link from "next/link";
import Image from "next/image";

const PLANS = [
  {
    name: "Plan Emprendedor",
    subtitle: "Ideal comercios pequeños",
    price: "$49",
    features: [
      { icon: "check_circle", text: "20 misiones/mes" },
      { icon: "check_circle", text: "Formatos Excel/PDF" },
      { icon: "check_circle", text: "Agentes básicos" },
    ],
    cta: "Empezar ahora",
    ctaStyle: "border border-outline-variant text-on-surface-variant hover:bg-surface-variant",
    featured: false,
  },
  {
    name: "Plan Profesional",
    subtitle: "Análisis avanzado de negocio",
    price: "$129",
    features: [
      { icon: "bolt", text: "80 misiones/mes", bold: true },
      { icon: "check_circle", text: "Agentes personalizados" },
      { icon: "check_circle", text: "Análisis ventas/marketing" },
      { icon: "check_circle", text: "Tips automáticos IA" },
    ],
    cta: "Elegir Profesional",
    ctaStyle: "bg-secondary text-on-secondary hover:brightness-110 shadow-md",
    featured: true,
  },
  {
    name: "Plan Empresa",
    subtitle: "Solución total corporativa",
    price: "$450",
    features: [
      { icon: "check_circle", text: "Misiones avanzadas ilimitadas" },
      { icon: "check_circle", text: "Control de roles y equipos" },
      { icon: "check_circle", text: "Reportes ejecutivos premium" },
      { icon: "support_agent", text: "Soporte prioritario 24/7", highlight: true },
    ],
    cta: "Contactar Ventas",
    ctaStyle: "border border-outline-variant text-on-surface-variant hover:bg-surface-variant",
    featured: false,
  },
];

export default function PreciosPage() {
  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="bg-background flex justify-between items-center px-margin-desktop py-md w-full max-w-7xl mx-auto sticky top-0 z-50">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          AgentHub
        </Link>
        <div className="hidden md:flex space-x-lg items-center">
          <Link href="/industrias" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">
            Industrias
          </Link>
          <Link href="/precios" className="font-body-md text-body-md text-secondary border-b-2 border-secondary">
            Precios
          </Link>
          <a href="#recursos" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">
            Recursos
          </a>
        </div>
        <Link
          href="/login"
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-title-md text-title-md hover:bg-secondary transition-colors active:opacity-80"
        >
          Iniciar Sesión
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-2xl">
        {/* ── Header ── */}
        <header className="text-center mb-2xl">
          <div className="inline-flex items-center px-md py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed-variant mb-lg font-label-sm text-label-sm">
            <span
              className="material-symbols-outlined mr-xs text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            EFICIENCIA SIN COMPLICACIONES
          </div>
          <h1 className="font-display-xl text-display-xl mb-md text-primary">
            Planes simples para negocios reales
          </h1>
          <p className="font-headline-md text-headline-md text-on-surface-variant max-w-2xl mx-auto">
            Sin complicaciones de tokens, solo misiones y resultados. Potencia tu empresa con la IA
            líder en Latinoamérica.
          </p>
        </header>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
          {PLANS.map((plan) =>
            plan.featured ? (
              <div
                key={plan.name}
                className="ai-gradient-border ai-glow p-lg flex flex-col transition-all duration-300 shadow-xl relative scale-105 z-10"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-lg py-xs rounded-full font-label-sm text-label-sm tracking-wider whitespace-nowrap">
                  MÁS POPULAR
                </div>
                <div className="mb-lg pt-sm">
                  <h3 className="font-headline-md text-headline-md text-primary mb-xs">{plan.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{plan.subtitle}</p>
                </div>
                <div className="flex items-baseline mb-lg">
                  <span className="font-display-xl text-display-xl text-primary">{plan.price}</span>
                  <span className="font-body-md text-body-md text-outline ml-xs">/mes</span>
                </div>
                <ul className="space-y-md mb-2xl flex-grow">
                  {plan.features.map((f) => (
                    <li key={f.text} className={`flex items-start gap-sm ${f.bold ? "font-semibold" : ""}`}>
                      <span
                        className="material-symbols-outlined text-secondary"
                        style={f.icon === "bolt" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {f.icon}
                      </span>
                      <span className="font-body-md text-body-md">{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/registro"
                  className={`w-full py-md rounded-lg font-title-md text-title-md text-center transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ) : (
              <div
                key={plan.name}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-lg">
                  <h3 className="font-headline-md text-headline-md text-primary mb-xs">{plan.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{plan.subtitle}</p>
                </div>
                <div className="flex items-baseline mb-lg">
                  <span className="font-display-xl text-display-xl text-primary">{plan.price}</span>
                  <span className="font-body-md text-body-md text-outline ml-xs">/mes</span>
                </div>
                <ul className="space-y-md mb-2xl flex-grow">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className={`flex items-start gap-sm ${f.highlight ? "font-semibold text-secondary" : ""}`}
                    >
                      <span className="material-symbols-outlined text-secondary">{f.icon}</span>
                      <span className="font-body-md text-body-md">{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Plan Empresa" ? "/contacto" : "/registro"}
                  className={`w-full py-md rounded-lg font-title-md text-title-md text-center transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          )}
        </div>

        {/* ── Bento extra ── */}
        <section className="mt-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Tech card */}
            <div className="bg-primary-container text-on-primary-container p-xl rounded-xl overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="font-headline-md text-headline-md text-white mb-md">
                  Tecnología de Vanguardia
                </h4>
                <p className="font-body-lg text-body-lg text-on-primary-container opacity-90 mb-lg">
                  Optimizamos modelos internamente para mantener calidad y costo, asegurando que tu
                  inversión se traduzca en resultados operativos tangibles sin preocuparte por la
                  volatilidad de los tokens.
                </p>
                <div className="flex gap-md flex-wrap">
                  {[
                    { icon: "memory", label: "LLM Optimizado" },
                    { icon: "shield", label: "ISO 27001" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="bg-on-primary-fixed-variant px-md py-sm rounded-lg flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-secondary-fixed">{b.icon}</span>
                      <span className="font-label-sm text-label-sm">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-secondary opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity pointer-events-none" />
            </div>

            {/* Guarantee card */}
            <div className="bg-white border border-outline-variant p-xl rounded-xl flex flex-col justify-center items-center text-center">
              <div className="mb-lg">
                <div className="w-20 h-20 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-md mx-auto">
                  <span className="material-symbols-outlined text-[40px]">handshake</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-primary mb-sm">
                  Garantía AgentHub
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Compromiso de entrega de resultados en cada misión. Si el agente no resuelve la
                  tarea según lo configurado, la misión no se descuenta de tu cuota mensual.
                </p>
              </div>
              <a
                href="#"
                className="font-title-md text-title-md text-secondary hover:underline flex items-center gap-xs"
              >
                Conoce más sobre nuestra tecnología
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Hero image ── */}
        <div className="mt-2xl rounded-xl overflow-hidden h-[400px] relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJ9MGlgQIUx0Ka_xtKKxELByf2MoV7gX5fYwna4EMYwgsUC0_mLRy4HpCX3zQ6bVtgTqx6e8qJhI_dL_fbpGEo0eIpAxfG9MlgL4rkRXO4ZdrzBfoZNPlhnNMWCUcsMJ_AUcCtyQGc408cn2dKly949CsLUKTBUqfjs7oWBr_q4E09Yy9h6pMs1DsqDZue8hj9r-PShe9WFwNiXAdHZ9_CJ3GHne1jQjwvwZQ94BybwGp8OXzmr5BkarHWW2BOvoy41nGYdI4Hwc"
            alt="Oficina corporativa futurista con análisis de IA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-xl">
            <div className="text-white max-w-xl">
              <h2 className="font-headline-lg text-headline-lg mb-sm">
                Inteligencia real para problemas reales
              </h2>
              <p className="font-body-lg text-body-lg opacity-90">
                Nuestra infraestructura está diseñada para ser el motor de eficiencia de la próxima
                generación de empresas en la región.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-background border-t border-outline-variant py-xl mt-2xl">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-title-md text-title-md font-bold text-primary mb-xs">AgentHub</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center md:text-left">
              © 2026 AgentHub Empresarial. Tecnología Avanzada con Rostro Humano.
            </p>
          </div>
          <div className="flex gap-xl flex-wrap justify-center">
            {["Privacidad", "Términos", "Contacto", "Blog"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-all duration-300"
              >
                {l}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-sm bg-surface-container-low px-md py-sm rounded-full">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant italic">
              Modelos optimizados internamente
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
