import { useReveal } from "@/hooks/use-reveal"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  const items = [
    { number: "01", title: "Отсутствие сегментации", desc: "Работа по единому шаблону — ресурсы уходят туда, где отдача минимальна", loss: "−34%" },
    { number: "02", title: "Работа по инерции", desc: "Без данных и приоритетов — команда тратит время вхолостую", loss: "−22%" },
    { number: "03", title: "Нет контроля сроков", desc: "Пропущенные окна взыскания — упущенная выручка навсегда", loss: "−18%" },
    { number: "04", title: "Неэффективный ресурс", desc: "Люди работают не там — и не работают там, где нужно", loss: "−27%" },
  ]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className={`mb-10 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
          <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-3">/ Реальные точки потерь</p>
          <h2 className="font-sans text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Где теряются <span className="relative inline-block">деньги<span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFD600]" /></span>
          </h2>
        </div>

        <div className="divide-y divide-black/6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`group flex items-center justify-between py-5 transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : (i % 2 === 0 ? "-translate-x-12 opacity-0" : "translate-x-12 opacity-0")
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-6 md:gap-10">
                <span className="font-mono text-xs text-foreground/25 w-6 shrink-0">{item.number}</span>
                <div>
                  <h3 className="font-sans text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors md:text-xl">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-foreground/45 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <span className="font-sans text-lg font-semibold text-red-500 md:text-xl">{item.loss}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 p-4 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/20 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="font-mono text-sm text-foreground/60">
            <span className="font-semibold text-foreground">Итого: </span>
            до <span className="text-red-500 font-semibold">−101% неэффективности</span> — проблема не в должниках, а в управлении.
          </p>
        </div>
      </div>
    </section>
  )
}
