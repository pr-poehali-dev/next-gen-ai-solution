import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import Icon from "@/components/ui/icon"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", company: "", phone: "", portfolioSize: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", company: "", phone: "", portfolioSize: "" })
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-16">

          {/* Left */}
          <div className={`flex flex-col justify-center transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
            <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-3">/ Бесплатный аудит</p>
            <h2 className="mb-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Узнайте,
              <br />
              <span className="relative inline-block">
                сколько теряете
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#FFD600]" />
              </span>
            </h2>
            <p className="text-sm text-foreground/55 leading-relaxed max-w-sm mb-6 md:text-base">
              За 30 минут покажем реальные точки потерь в вашем портфеле — без обязательств и воды.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Анализ структуры портфеля",
                "Оценка текущих потерь в рублях",
                "Рекомендации по сегментации",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#FFD600]/20 border border-[#FFD600]/30 flex items-center justify-center shrink-0">
                    <Icon name="Check" size={10} className="text-foreground/70" />
                  </div>
                  <span className="text-sm text-foreground/60">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {["Telegram", "LinkedIn"].map((social) => (
                <a key={social} href="#" className="font-mono text-xs text-foreground/40 border-b border-transparent hover:border-foreground/30 hover:text-foreground/60 transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className={`flex flex-col justify-center transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`} style={{ transitionDelay: "150ms" }}>
            <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name", label: "Имя и фамилия", placeholder: "Иван Петров", type: "text" },
                  { key: "company", label: "Компания", placeholder: "Банк / МФО / Агентство", type: "text" },
                  { key: "phone", label: "Телефон", placeholder: "+7 (900) 000-00-00", type: "tel" },
                  { key: "portfolioSize", label: "Размер портфеля (млн ₽)", placeholder: "Например: 500", type: "text" },
                ].map((field, i) => (
                  <div key={field.key} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${200 + i * 80}ms` }}>
                    <label className="mb-1.5 block font-mono text-xs text-foreground/45">{field.label}</label>
                    <input
                      type={field.type}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      required={field.key === "name" || field.key === "phone"}
                      className="w-full rounded-xl border border-black/10 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-[#FFD600]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD600]/20 transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div className={`pt-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "550ms" }}>
                  <MagneticButton variant="primary" size="lg" className="w-full">
                    {isSubmitting ? "Отправляем..." : "Получить бесплатный аудит"}
                  </MagneticButton>
                  {submitSuccess && (
                    <p className="mt-3 text-center font-mono text-sm text-emerald-600">Заявка принята! Свяжемся в течение часа.</p>
                  )}
                  <p className="mt-2 text-center font-mono text-[10px] text-foreground/30">Без спама и обязательств</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
