import { useReveal } from "@/hooks/use-reveal"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-10 transition-all duration-700 md:mb-14 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Где теряются
            <br />
            <span className="text-[#FFD600]">деньги</span>
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Реальные точки потерь</p>
        </div>

        <div className="space-y-5 md:space-y-6">
          {[
            {
              number: "01",
              title: "Отсутствие сегментации",
              category: "Работа по единому шаблону — деньги уходят туда, где их нет",
              year: "—34%",
              direction: "left",
            },
            {
              number: "02",
              title: "Работа по инерции",
              category: "Без данных, без приоритетов — ресурсы тратятся вхолостую",
              year: "—22%",
              direction: "right",
            },
            {
              number: "03",
              title: "Нет контроля сроков",
              category: "Пропущенные окна взыскания = упущенная выручка навсегда",
              year: "—18%",
              direction: "left",
            },
            {
              number: "04",
              title: "Неэффективный ресурс",
              category: "Люди работают там, где не нужно — и не работают там, где нужно",
              year: "—27%",
              direction: "right",
            },
          ].map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  const isLoss = project.year.startsWith("—")

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-4 transition-all duration-700 hover:border-[#FFD600]/30 md:py-5 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "88%" : "92%",
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-[#FFD600]/50 md:text-base">
          {project.number}
        </span>
        <div>
          <h3 className="mb-0.5 font-sans text-xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-2xl lg:text-3xl">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{project.category}</p>
        </div>
      </div>
      <span className={`font-mono text-sm font-medium md:text-base ${isLoss ? "text-red-400" : "text-green-400"}`}>
        {project.year}
      </span>
    </div>
  )
}