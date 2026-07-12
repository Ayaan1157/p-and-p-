import { Link } from "@tanstack/react-router";
import { disciplines, type Discipline } from "@/data/work";

type Tile = {
  src: string;
  title: string;
  discipline: Discipline;
  color: string;
  location: string;
  year: number;
};

// Keep the 24 best project images for a 6 × 4 collage grid.
const tiles: Tile[] = (Object.entries(disciplines) as [Discipline, typeof disciplines[Discipline]][])
  .flatMap(([key, d]) =>
    d.projects.flatMap((p) =>
      p.images.map((src) => ({
        src,
        title: p.title,
        discipline: key,
        color: d.color,
        location: p.location,
        year: p.year,
      })),
    ),
  )
  .slice(0, 24);

export function Projects() {
  return (
    <section id="projects" className="relative py-32 md:py-44">
      <span className="ghost-numeral absolute right-2 top-12 text-[18vw] md:right-8">03</span>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="eyebrow">Collage</p>
            <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]">
              Selected <span style={{ color: "var(--gold)" }}>Works.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
              Hover any frame to bring it forward. Click to open the discipline and explore the full project.
            </p>
          </div>
        </div>

        <div className="reveal collage mt-16 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {tiles.map((t, i) => (
            <Link
              key={`${t.src}-${i}`}
              to="/work/$discipline"
              params={{ discipline: t.discipline }}
              hash={t.title.replace(/\s+/g, "-").toLowerCase()}
              data-cursor="hover"
              className="collage-tile group relative block overflow-hidden"
              style={{
                background: "var(--navy-deep)",
                transformOrigin: "center",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={t.src}
                alt={`${t.title} — ${disciplines[t.discipline].label.toLowerCase()} project in ${t.location} by Paper & Pencil`}
                loading={i < 6 ? "eager" : "lazy"}
                decoding="async"
                width={480}
                height={360}
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="block aspect-[4/3] h-full w-full object-cover"
                style={{ borderBottom: `3px solid ${t.color}` }}
              />

              <div
                className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 100%)",
                }}
              >
                <span
                  className="mb-2 inline-block w-fit px-2 py-1 text-[9px] uppercase tracking-[0.3em]"
                  style={{ background: t.color, color: "var(--cream)" }}
                >
                  {disciplines[t.discipline].label}
                </span>
                <h3 className="font-serif text-lg leading-tight text-white">{t.title}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/70">
                  {t.location} · {t.year}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
