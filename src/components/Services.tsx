import { Link } from "@tanstack/react-router";
import { type Discipline } from "@/data/work";
import { useAppStore } from "@/lib/store";

export function Services() {
  const { disciplines } = useAppStore();

  const services = (Object.entries(disciplines) as [Discipline, typeof disciplines[Discipline]][]).map(
    ([slug, d], i) => ({
      slug,
      n: String(i + 1).padStart(2, "0"),
      title: d.label,
      desc: d.tagline,
      color: d.color,
    })
  );
  return (
    <section id="services" className="relative border-t py-32 md:py-44" style={{ borderColor: "var(--border)", background: "var(--navy-deep)" }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="reveal max-w-xl">
            <p className="eyebrow">Practice</p>
            <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]">
              Four disciplines, <span style={{ color: "var(--gold)" }}>one hand.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-1 max-w-sm text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
            Everything begins with a paper and pencil
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: "var(--border)" }}>
          {services.map((s, i) => (
            <Link
              key={s.slug}
              to="/work/$discipline"
              params={{ discipline: s.slug }}
              className="reveal group relative block overflow-hidden p-10 transition-colors duration-700 md:p-14"
              style={{ background: "var(--ink)", transitionDelay: `${i * 80}ms` }}
              data-cursor="hover"
            >
              <span
                className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-y-100"
                style={{ background: s.color }}
              />
              <div className="relative flex min-h-[280px] flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-sans text-sm font-light transition-colors duration-500 group-hover:text-cream" style={{ color: "var(--gold)" }}>{s.n}</span>
                  <span className="text-xs uppercase tracking-[0.28em] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:text-cream" style={{ color: "var(--cream)" }}>
                    View work →
                  </span>
                </div>
                <div>
                  <h3 className="font-sans text-3xl font-light tracking-wide transition-all duration-700 ease-[var(--ease-luxury)] group-hover:-translate-y-1 group-hover:text-cream md:text-4xl text-cream">
                    {s.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm font-light leading-relaxed transition-colors duration-500 text-grey-soft group-hover:text-cream/90">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
