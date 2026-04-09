import { useReveal } from "@/hooks/use-reveal"
import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [portfolio, setPortfolio] = useState(500)
  const [recovery, setRecovery] = useState(12)
  const [animated, setAnimated] = useState(false)
  const [displayLoss, setDisplayLoss] = useState(0)
  const [displayGrowth, setDisplayGrowth] = useState(0)

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
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Калькулятор
            <br />
            <span className="text-[#FFD600]">потерь</span>
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Посчитайте свои деньги прямо сейчас</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {/* Inputs */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs text-foreground/60 uppercase tracking-widest">Портфель (млн ₽)</label>
                <span className="font-sans text-lg font-light text-foreground">{portfolio} млн</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={portfolio}
                onChange={(e) => setPortfolio(Number(e.target.value))}
                className="w-full h-1 bg-foreground/20 rounded-full appearance-none cursor-pointer accent-[#FFD600]"
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[10px] text-foreground/30">50 млн</span>
                <span className="font-mono text-[10px] text-foreground/30">5 000 млн</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs text-foreground/60 uppercase tracking-widest">Текущий % взыскания</label>
                <span className="font-sans text-lg font-light text-foreground">{recovery}%</span>
              </div>
              <input
                type="range"
                min={3}
                max={40}
                step={1}
                value={recovery}
                onChange={(e) => setRecovery(Number(e.target.value))}
                className="w-full h-1 bg-foreground/20 rounded-full appearance-none cursor-pointer accent-[#FFD600]"
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[10px] text-foreground/30">3%</span>
                <span className="font-mono text-[10px] text-foreground/30">40%</span>
              </div>
            </div>

            <div className="pt-2 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
              <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-2">Что платформа делает</p>
              <ul className="space-y-1.5">
                {[
                  "Сегментирует портфель по приоритету",
                  "Контролирует сроки по каждому делу",
                  "Прогнозирует результат по агентам",
                  "Показывает точки роста в реальном времени",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="Check" size={12} className="text-[#FFD600] mt-0.5 shrink-0" />
                    <span className="font-mono text-xs text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs text-red-400/70 uppercase tracking-widest mb-2">Теряете сейчас</p>
                <p className="font-sans text-5xl font-light text-red-400 md:text-6xl">
                  {displayLoss.toLocaleString("ru-RU")}
                  <span className="text-2xl ml-1">млн ₽</span>
                </p>
              </div>
              <p className="font-mono text-xs text-foreground/40 mt-3">ежегодно остаётся в невзысканном портфеле</p>
            </div>

            <div className="flex-1 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs text-green-400/70 uppercase tracking-widest mb-2">Потенциал роста</p>
                <p className="font-sans text-5xl font-light text-green-400 md:text-6xl">
                  +{displayGrowth.toLocaleString("ru-RU")}
                  <span className="text-2xl ml-1">млн ₽</span>
                </p>
              </div>
              <p className="font-mono text-xs text-foreground/40 mt-3">можно вернуть при оптимизации управления</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}