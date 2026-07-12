import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { disciplines, type Discipline } from "@/data/work";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

const valid = Object.keys(disciplines) as Discipline[];

export const Route = createFileRoute("/work/$discipline")({
  beforeLoad: ({ params }) => {
    if (!valid.includes(params.discipline as Discipline)) throw notFound();
  },
  head: ({ params }) => {
    const d = disciplines[params.discipline as Discipline];
    const title = d ? `${d.label} Work — Paper & Pencil` : "Work — Paper & Pencil";
    const desc = d?.tagline ?? "Selected work by Paper & Pencil.";
    const url = `https://velvet-folio-lab.lovable.app/work/${params.discipline}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: d
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `${d.label} Work — Paper & Pencil`,
                description: d.tagline,
                url,
                hasPart: d.projects.map((p) => ({
                  "@type": "CreativeWork",
                  name: p.title,
                  locationCreated: p.location,
                  dateCreated: String(p.year),
                })),
              }),
            },
          ]
        : [],
    };
  },
  component: WorkPage,
  notFoundComponent: () => (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-serif text-2xl">Discipline not found.</p>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-serif text-2xl">{error.message}</p>
    </main>
  ),
});

function WorkPage() {
  const { discipline } = Route.useParams();
  const d = disciplines[discipline as Discipline];
  const others = (Object.entries(disciplines) as [Discipline, typeof d][]).filter(([k]) => k !== discipline);

  return (
    <main className="relative" style={{ background: "var(--ink)" }}>
      <CustomCursor />
      <Nav />

      <section
        className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32"
        style={{ background: d.color, color: "var(--cream)" }}
      >
        <span className="ghost-numeral absolute -left-2 top-20 text-[22vw] opacity-40 md:left-8">{d.code}</span>
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <Link to="/" className="text-[10px] uppercase tracking-[0.32em] opacity-80 hover:opacity-100">
            ← Back
          </Link>
          <p className="mt-10 text-[11px] uppercase tracking-[0.32em] opacity-90">Discipline</p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.95]">{d.label}</h1>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed opacity-90">{d.tagline}</p>
          <p className="mt-10 text-[11px] uppercase tracking-[0.32em] opacity-80">
            {d.projects.length} {d.projects.length === 1 ? "Project" : "Projects"}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 space-y-24 md:space-y-32">
          {d.projects.map((p, i) => (
            <article
              key={`${p.title}-${i}`}
              className="border-t pt-10 md:pt-14"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-2 font-serif text-sm md:text-base" style={{ color: d.color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-10 md:col-span-6">
                  <h2 className="font-serif text-2xl md:text-4xl">{p.title}</h2>
                  {p.note && (
                    <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
                      {p.note}
                    </p>
                  )}
                </div>
                <div className="col-span-4 md:col-span-2 text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--grey)" }}>
                  {p.location}
                </div>
                <div className="col-span-4 md:col-span-1 text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--grey)" }}>
                  {p.size}
                </div>
                <div className="col-span-4 md:col-span-1 text-right font-serif text-base" style={{ color: "var(--gold)" }}>
                  {p.year}
                </div>
              </div>

              {p.images.length > 0 && (
                <div
                  className={`mt-10 grid gap-4 md:gap-6 ${
                    p.images.length === 1
                      ? "grid-cols-1"
                      : p.images.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {p.images.map((src, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden"
                      style={{ background: "var(--navy-deep)" }}
                    >
                      <img
                        src={src}
                        alt={`${p.title} — view ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="block h-auto w-full transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-[1.02]"
                        style={{ borderTop: `3px solid ${d.color}` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <h2 className="eyebrow">Other Disciplines</h2>
          <div className="mt-8 grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: "var(--border)" }}>
            {others.map(([key, o]) => (
              <Link
                key={key}
                to="/work/$discipline"
                params={{ discipline: key }}
                className="group relative block overflow-hidden p-10 transition-colors duration-500"
                style={{ background: "var(--ink)" }}
              >
                <span
                  className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-y-100"
                  style={{ background: o.color }}
                />
                <div className="relative">
                  <span className="font-serif text-sm" style={{ color: o.color }}>{o.code}</span>
                  <h2 className="mt-4 font-serif text-3xl">{o.label}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
