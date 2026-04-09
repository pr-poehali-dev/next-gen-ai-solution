import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div>
            <div className={`mb-6 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
              <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-3">/ О платформе</p>
              <h2 className="font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Аналитика,
                <br />
                которая
                <br />
                <span className="relative inline-block">
                  работает
                  <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFD600]" />
                </span>
              </h2>
            </div>

            <div
              className={`space-y-4 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/60 md:text-base">
                OnePlaceCollection — это не коллекторская услуга. Это аналитическая система, которая показывает, где и почему теряется эффективность.
              </p>
              <p className="max-w-md text-sm leading-relaxed text-foreground/60 md:text-base">
                Работаем с банками, МФО и коллекторскими агентствами — там, где управление портфелем напрямую влияет на выручку.
              </p>
            </div>

            <div
              className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(4)}>
                Проверить портфель
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(4)}>
                Получить аудит
              </MagneticButton>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4 md:space-y-6">
            {[
              { value: "3–7×", label: "Рост эффективности", sub: "в первые 90 дней работы" },
              { value: "₽млрд+", label: "Портфелей под управлением", sub: "банки, МФО, коллекторы" },
              { value: "94%", label: "Клиентов продлевают", sub: "подписку после первого года" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-5 p-5 rounded-2xl border border-border bg-white shadow-md shadow-black/5 transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="text-3xl font-semibold text-foreground md:text-4xl shrink-0 w-24">{stat.value}</div>
                <div className="border-l border-border pl-5">
                  <div className="font-sans text-sm font-medium text-foreground">{stat.label}</div>
                  <div className="font-mono text-xs text-foreground/40 mt-0.5">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}