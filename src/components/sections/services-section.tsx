import { useReveal } from "@/hooks/use-reveal"
import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [portfolio, setPortfolio] = useState(500)
  const [recovery, setRecovery] = useState(12)
  const [displayLoss, setDisplayLoss] = useState(0)
  const [displayGrowth, setDisplayGrowth] = useState(0)
  const [animated, setAnimated] = useState(false)

  const loss = Math.round(portfolio * (1 - recovery / 100) * 0.28)
  const growth = Math.round(portfolio * 0.07)

  useEffect(() => {
    if (!isVisible || animated) return
    setAnimated(true)
    const steps = 50
    const duration = 1200
    let step = 0
    const timer = setInterval(() => {
      step++
      const p = step / steps
      setDisplayLoss(Math.round(loss * p))
      setDisplayGrowth(Math.round(growth * p))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isVisible])

  useEffect(() => {
    setDisplayLoss(loss)
    setDisplayGrowth(growth)
  }, [loss, growth])

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
          <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-3">/ Финансовый инструмент</p>
          <h2 className="font-sans text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Калькулятор <span className="relative inline-block">потерь<span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFD600]" /></span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Inputs */}
          <div className={`space-y-6 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`} style={{ transitionDelay: "150ms" }}>
            <div className="p-5 rounded-2xl border border-border bg-white shadow-md shadow-black/5">
              <div className="flex items-center justify-between mb-3">
                <label className="font-mono text-xs text-foreground/50 uppercase tracking-widest">Портфель</label>
                <span className="font-sans text-base font-semibold text-foreground">{portfolio.toLocaleString("ru-RU")} млн ₽</span>
              </div>
              <input
                type="range" min={50} max={5000} step={50} value={portfolio}
                onChange={(e) => setPortfolio(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#FFD600]"
              />
              <div className="flex justify-between mt-1.5">
                <span className="font-mono text-[10px] text-foreground/30">50 млн</span>
                <span className="font-mono text-[10px] text-foreground/30">5 000 млн</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-white shadow-md shadow-black/5">
              <div className="flex items-center justify-between mb-3">
                <label className="font-mono text-xs text-foreground/50 uppercase tracking-widest">Взыскание сейчас</label>
                <span className="font-sans text-base font-semibold text-foreground">{recovery}%</span>
              </div>
              <input
                type="range" min={3} max={40} step={1} value={recovery}
                onChange={(e) => setRecovery(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#FFD600]"
              />
              <div className="flex justify-between mt-1.5">
                <span className="font-mono text-[10px] text-foreground/30">3%</span>
                <span className="font-mono text-[10px] text-foreground/30">40%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#FFD600]/30 bg-[#FFD600]/10">
              <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-2">Что даёт платформа</p>
              <ul className="space-y-1.5">
                {[
                  "Сегментирует портфель по приоритету",
                  "Контролирует сроки по каждому делу",
                  "Прогнозирует результат по агентам",
                  "Показывает точки роста в реальном времени",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="Check" size={12} className="text-foreground/60 mt-0.5 shrink-0" />
                    <span className="font-mono text-xs text-foreground/60">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results */}
          <div className={`flex flex-col gap-4 transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`} style={{ transitionDelay: "300ms" }}>
            <div className="flex-1 rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-3">Теряете ежегодно</p>
                <p className="font-sans text-5xl font-semibold text-red-500 md:text-6xl">
                  {displayLoss.toLocaleString("ru-RU")}
                  <span className="text-2xl font-normal ml-1">млн ₽</span>
                </p>
              </div>
              <p className="font-mono text-xs text-foreground/40 mt-4">остаётся в невзысканном портфеле из-за плохого управления</p>
            </div>

            <div className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <p className="font-mono text-xs text-emerald-600 uppercase tracking-widest mb-3">Потенциал роста</p>
                <p className="font-sans text-5xl font-semibold text-emerald-600 md:text-6xl">
                  +{displayGrowth.toLocaleString("ru-RU")}
                  <span className="text-2xl font-normal ml-1">млн ₽</span>
                </p>
              </div>
              <p className="font-mono text-xs text-foreground/40 mt-4">можно вернуть при оптимизации управления портфелем</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}