import { CustomCursor } from "@/components/custom-cursor"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const scrollThrottleRef = useRef<number>()
  const [lossCount, setLossCount] = useState(0)
  const [growthCount, setGrowthCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const lossTarget = 34
    const growthTarget = 127
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setLossCount(Math.round(lossTarget * progress))
      setGrowthCount(Math.round(growthTarget * progress))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) e.preventDefault()
    }
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const deltaX = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) scrollToSection(currentSection + 1)
        else if (deltaY < 0 && currentSection > 0) scrollToSection(currentSection - 1)
      }
    }
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        if (!scrollContainerRef.current) return
        scrollContainerRef.current.scrollBy({ left: e.deltaY, behavior: "instant" })
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) setCurrentSection(newSection)
      }
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("wheel", handleWheel, { passive: false })
    return () => { if (container) container.removeEventListener("wheel", handleWheel) }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return
      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) { scrollThrottleRef.current = undefined; return }
        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) setCurrentSection(newSection)
        scrollThrottleRef.current = undefined
      })
    }
    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />

      {/* Subtle background accent */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FFD600]/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#FFD600]/5 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 border-b border-black/6 bg-white/80 backdrop-blur-md">
        <button onClick={() => scrollToSection(0)} className="flex items-center gap-3 transition-transform hover:scale-105">
          <img
            src="https://cdn.poehali.dev/projects/a4c6c3a9-5898-4bcd-9cf1-d79afacd9921/bucket/ae31cd01-2f18-4677-bbe2-03d4a1cb3389.png"
            alt="ВБ Трейд"
            className="h-8 w-auto object-contain"
          />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Главная", "Проблема", "Продукт", "О нас", "Контакты"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#FFD600] rounded-full transition-all duration-300 ${
                currentSection === index ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </button>
          ))}
        </div>

        <MagneticButton variant="primary" onClick={() => scrollToSection(4)}>
          Получить аудит
        </MagneticButton>
      </nav>

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className="relative z-10 flex h-screen overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero */}
        <section className="flex min-h-screen w-screen shrink-0 items-center px-6 pt-24 pb-12 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">

              {/* Left */}
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD600]/40 bg-[#FFD600]/10 px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />
                  <p className="font-mono text-xs text-foreground/70">Fintech SaaS · Управление портфелем</p>
                </div>

                <h1 className="mb-6 font-sans text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  Ваш портфель
                  <br />
                  <span className="relative inline-block">
                    теряет деньги
                    <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFD600]" />
                  </span>
                  <span className="text-foreground/25">.</span>
                </h1>

                <p className="mb-8 max-w-lg text-base leading-relaxed text-foreground/60 md:text-lg">
                  OnePlaceCollection — платформа аналитики для банков, МФО и коллекторских агентств. Показывает, где теряется эффективность, и помогает её вернуть.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(4)}>
                    Проверить портфель
                  </MagneticButton>
                  <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(4)}>
                    Получить аудит
                  </MagneticButton>
                </div>

                <div className="mt-10 flex gap-8">
                  {[
                    { val: "3–7×", label: "рост эффективности" },
                    { val: "94%", label: "продлений подписки" },
                    { val: "30 дн", label: "до первых результатов" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-sans text-xl font-semibold text-foreground">{s.val}</div>
                      <div className="font-mono text-xs text-foreground/40 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Dashboard */}
              <div className="animate-in fade-in duration-1000 delay-300">
                <div className="rounded-2xl border border-black/8 bg-white shadow-xl shadow-black/5 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-black/6">
                    <span className="font-mono text-xs text-foreground/40">OPC · Аналитика портфеля</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      live
                    </span>
                  </div>

                  {/* Segmentation */}
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Сегментация портфеля</p>
                    <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 transition-all duration-1000" style={{ width: "18%" }} />
                      <div className="bg-[#FFD600] transition-all duration-1000" style={{ width: "31%" }} />
                      <div className="bg-red-400 transition-all duration-1000" style={{ width: "51%" }} />
                    </div>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-mono text-xs text-foreground/60"><span className="h-2 w-2 rounded-sm bg-emerald-400" />A — 18%</span>
                      <span className="flex items-center gap-1 font-mono text-xs text-foreground/60"><span className="h-2 w-2 rounded-sm bg-[#FFD600]" />B — 31%</span>
                      <span className="flex items-center gap-1 font-mono text-xs text-foreground/60"><span className="h-2 w-2 rounded-sm bg-red-400" />C — 51%</span>
                    </div>
                  </div>

                  {/* Loss / Growth */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                      <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest mb-1">Потери сейчас</p>
                      <p className="font-sans text-2xl font-semibold text-red-500">
                        {lossCount}<span className="text-sm font-normal ml-0.5">%</span>
                      </p>
                      <p className="font-mono text-[10px] text-foreground/40">от портфеля</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                      <p className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest mb-1">Потенциал</p>
                      <p className="font-sans text-2xl font-semibold text-emerald-600">
                        +{growthCount}<span className="text-sm font-normal ml-0.5">М ₽</span>
                      </p>
                      <p className="font-mono text-[10px] text-foreground/40">в год</p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Распределение ресурсов</p>
                    {[
                      { label: "Сегмент A", value: 72, color: "bg-emerald-400" },
                      { label: "Сегмент B", value: 45, color: "bg-[#FFD600]" },
                      { label: "Сегмент C", value: 18, color: "bg-red-400" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-foreground/40 w-20 shrink-0">{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-black/6">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                        </div>
                        <span className="font-mono text-[9px] text-foreground/40">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/40">Листайте вправо</p>
              <div className="flex h-5 w-10 items-center justify-center rounded-full border border-black/10 bg-black/4">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFD600]" />
              </div>
            </div>
          </div>
        </section>

        <WorkSection />
        <ServicesSection />
        <AboutSection scrollToSection={scrollToSection} />
        <ContactSection />
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  )
}
