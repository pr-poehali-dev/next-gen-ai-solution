import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import Icon from "@/components/ui/icon"

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()
  const [lossCount, setLossCount] = useState(0)
  const [growthCount, setGrowthCount] = useState(0)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
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
  }, [isLoaded])

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
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
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

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#0a0a0a"
            colorB="#FFD600"
            speed={0.4}
            detail={0.6}
            blend={60}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={20}
            fineY={20}
          />
          <ChromaFlow
            baseColor="#0d0d0d"
            upColor="#0d0d0d"
            downColor="#1a1a1a"
            leftColor="#FFD600"
            rightColor="#e6c100"
            intensity={0.85}
            radius={1.5}
            momentum={20}
            maskType="alpha"
            opacity={0.96}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <img
            src="https://cdn.poehali.dev/projects/a4c6c3a9-5898-4bcd-9cf1-d79afacd9921/bucket/ae31cd01-2f18-4677-bbe2-03d4a1cb3389.png"
            alt="ВБ Трейд"
            className="h-9 w-auto object-contain"
          />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Главная", "Проблема", "Продукт", "О нас", "Контакты"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-[#FFD600]" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[#FFD600] transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(4)}>
          Получить аудит
        </MagneticButton>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section className="flex min-h-screen w-screen shrink-0 items-center px-6 pt-24 pb-12 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              {/* Left */}
              <div>
                <div className="mb-5 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 px-4 py-1.5 backdrop-blur-md duration-700">
                  <p className="font-mono text-xs text-[#FFD600]">Fintech SaaS · Управление портфелем</p>
                </div>
                <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.05] tracking-tight text-foreground duration-1000 md:text-6xl lg:text-7xl">
                  Ваш портфель
                  <br />
                  <span className="text-[#FFD600]">теряет деньги.</span>
                  <br />
                  <span className="text-foreground/50 text-4xl md:text-5xl lg:text-6xl">Каждый день.</span>
                </h1>
                <p className="mb-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-foreground/80 duration-1000 delay-200 md:text-lg">
                  OnePlaceCollection — платформа для анализа и управления портфелем исполнительных производств. Показывает, где теряется эффективность, и помогает её вернуть.
                </p>
                <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
                  <MagneticButton
                    size="lg"
                    variant="primary"
                    onClick={() => scrollToSection(4)}
                  >
                    Проверить портфель
                  </MagneticButton>
                  <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(4)}>
                    Получить аудит
                  </MagneticButton>
                </div>
              </div>

              {/* Right — Псевдо-дашборд */}
              <div className="animate-in fade-in duration-1000 delay-500">
                <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-md p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground/50">OPC · Аналитика портфеля</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      live
                    </span>
                  </div>

                  {/* Segmentation A/B/C */}
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Сегментация портфеля</p>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                      <div className="bg-green-500/80 transition-all duration-1000" style={{ width: "18%" }} />
                      <div className="bg-[#FFD600]/80 transition-all duration-1000" style={{ width: "31%" }} />
                      <div className="bg-red-500/60 transition-all duration-1000" style={{ width: "51%" }} />
                    </div>
                    <div className="flex gap-4">
                      <span className="font-mono text-xs text-green-400">A — 18%</span>
                      <span className="font-mono text-xs text-[#FFD600]">B — 31%</span>
                      <span className="font-mono text-xs text-red-400">C — 51%</span>
                    </div>
                  </div>

                  {/* Потери / Потенциал */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                      <p className="font-mono text-[10px] text-red-400/70 uppercase tracking-widest mb-1">Потери сейчас</p>
                      <p className="font-sans text-2xl font-light text-red-400">
                        {lossCount}<span className="text-base">%</span>
                      </p>
                      <p className="font-mono text-[10px] text-foreground/40">от портфеля</p>
                    </div>
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
                      <p className="font-mono text-[10px] text-green-400/70 uppercase tracking-widest mb-1">Потенциал роста</p>
                      <p className="font-sans text-2xl font-light text-green-400">
                        +{growthCount}<span className="text-base">М ₽</span>
                      </p>
                      <p className="font-mono text-[10px] text-foreground/40">в год</p>
                    </div>
                  </div>

                  {/* Распределение ресурсов */}
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Распределение ресурсов</p>
                    {[
                      { label: "Сегмент A (приоритет)", value: 72, color: "bg-green-500/70" },
                      { label: "Сегмент B (резерв)", value: 45, color: "bg-[#FFD600]/70" },
                      { label: "Сегмент C (аутсорс)", value: 18, color: "bg-red-500/50" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-foreground/40 w-32 shrink-0">{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-foreground/10">
                          <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                        </div>
                        <span className="font-mono text-[9px] text-foreground/50">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Листайте вправо</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#FFD600]" />
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
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}