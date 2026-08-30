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

// Interleave project images from each discipline to get a perfect mix of categories
const getMixedTiles = (): Tile[] => {
  const list: Record<Discipline, Tile[]> = {
    institutional: [],
    industrial: [],
    commercial: [],
    residential: [],
  };

  (Object.entries(disciplines) as [Discipline, typeof disciplines[Discipline]][]).forEach(([key, d]) => {
    d.projects.forEach((p) => {
      p.images.forEach((src) => {
        list[key].push({
          src,
          title: p.title,
          discipline: key,
          color: d.color,
          location: p.location,
          year: p.year,
        });
      });
    });
  });

  const mixed: Tile[] = [];
  const keys: Discipline[] = ["institutional", "industrial", "commercial", "residential"];
  let hasMore = true;
  let index = 0;

  while (hasMore) {
    hasMore = false;
    keys.forEach((key) => {
      if (list[key] && list[key][index]) {
        mixed.push(list[key][index]);
        hasMore = true;
      }
    });
    index++;
  }

  return mixed.slice(0, 17); // Take exactly 17 items for the treemap grid
};

const tiles = getMixedTiles();

// Mathematically packing spans for 2 columns on mobile and 8 columns on desktop
const layoutSpans = [
  { sm: "col-span-2 row-span-2", md: "md:col-span-3 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-3 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-2 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-1 row-span-2", md: "md:col-span-2 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-4 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-2 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-3 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-3 md:row-span-2" },
  { sm: "col-span-2 row-span-2", md: "md:col-span-2 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-1" },
  { sm: "col-span-2 row-span-1", md: "md:col-span-4 md:row-span-1" },
  { sm: "col-span-1 row-span-2", md: "md:col-span-4 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-2" },
  { sm: "col-span-1 row-span-1", md: "md:col-span-2 md:row-span-2" },
];

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-32 md:py-44">
      <span className="ghost-numeral absolute right-2 top-12 text-[18vw] md:right-8">03</span>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="eyebrow">Collage</p>
            <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]">
              Selected <span style={{ color: "var(--gold)" }}>Works.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
              Explore the quiet poetry of hand-drawn lines, material spaces, and built environments. Click any frame to view details.
            </p>
          </div>
        </div>

        <div className="reveal collage mt-16 grid grid-cols-2 gap-4 grid-flow-dense auto-rows-[180px] md:grid-cols-8 md:auto-rows-[240px] md:gap-4">
          {tiles.map((t, i) => {
            const span = layoutSpans[i % layoutSpans.length];
            return (
              <Link
                key={`${t.src}-${i}`}
                to="/work/$discipline"
                params={{ discipline: t.discipline }}
                hash={t.title.replace(/\s+/g, "-").toLowerCase()}
                data-cursor="hover"
                className={`collage-tile group relative block overflow-hidden ${span.sm} ${span.md}`}
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
                  className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxury)] group-hover:scale-105"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
