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
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:mb-3 md:text-6xl lg:text-7xl">
                Узнайте,
                <br />
                <span className="text-[#FFD600]">сколько</span>
                <br />
                вы теряете
              </h2>
              <p className="font-mono text-xs text-foreground/60 md:text-base">/ Бесплатный аудит портфеля</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <p className="text-base text-foreground/80 md:text-lg max-w-sm">
                  За 30 минут мы покажем реальные точки потерь в вашем портфеле — без обязательств.
                </p>
              </div>

              <div
                className={`space-y-3 transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                {[
                  "Анализ структуры портфеля",
                  "Оценка текущих потерь",
                  "Рекомендации по сегментации",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#FFD600]/20 border border-[#FFD600]/40 flex items-center justify-center shrink-0">
                      <Icon name="Check" size={10} className="text-[#FFD600]" />
                    </div>
                    <span className="font-mono text-sm text-foreground/70">{item}</span>
                  </div>
                ))}
              </div>

              <div
                className={`flex gap-4 pt-2 transition-all duration-700 md:pt-4 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {["Telegram", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="border-b border-transparent font-mono text-xs text-foreground/60 transition-all hover:border-[#FFD600]/60 hover:text-[#FFD600]/90"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {[
                { key: "name", label: "Имя и фамилия", placeholder: "Иван Петров", type: "text", delay: "200ms" },
                { key: "company", label: "Компания", placeholder: "Банк / МФО / Агентство", type: "text", delay: "300ms" },
                { key: "phone", label: "Телефон", placeholder: "+7 (900) 000-00-00", type: "tel", delay: "400ms" },
                { key: "portfolioSize", label: "Размер портфеля (млн ₽)", placeholder: "Например: 500", type: "text", delay: "500ms" },
              ].map((field) => (
                <div
                  key={field.key}
                  className={`transition-all duration-700 ${
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: field.delay }}
                >
                  <label className="mb-1.5 block font-mono text-xs text-foreground/60 md:mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.key === "name" || field.key === "phone"}
                    className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-[#FFD600]/60 focus:outline-none md:py-2 md:text-base transition-colors"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Отправляем..." : "Получить бесплатный аудит"}
                </MagneticButton>
                {submitSuccess && (
                  <p className="mt-3 text-center font-mono text-sm text-[#FFD600]">Заявка принята! Свяжемся в течение часа.</p>
                )}
                <p className="mt-2 text-center font-mono text-[10px] text-foreground/30">Без спама и обязательств</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}