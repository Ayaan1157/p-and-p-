import { useEffect } from "react";
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
      title,
      meta: [
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

  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
    projectIndex: number;
    imageIndex: number;
  } | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = decodeURIComponent(hash.substring(1));
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, [discipline]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const navigateLightbox = (direction: number) => {
    if (!lightbox) return;
    const project = d.projects[lightbox.projectIndex];
    if (!project) return;
    const newIdx = lightbox.imageIndex + direction;
    if (newIdx >= 0 && newIdx < project.images.length) {
      setLightbox({
        ...lightbox,
        src: project.images[newIdx],
        imageIndex: newIdx,
      });
    }
  };

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
          {d.projects.map((p, pIdx) => (
            <article
              key={`${p.title}-${pIdx}`}
              id={p.title.replace(/\s+/g, "-").toLowerCase()}
              className="border-t pt-10 md:pt-14 scroll-mt-28"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:items-baseline md:gap-4">
                <div className="flex items-start gap-4 col-span-8">
                  <span className="font-serif text-sm md:text-base shrink-0" style={{ color: d.color }}>
                    {String(pIdx + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-3">
                    <h2 className="font-serif text-2xl md:text-4xl">{p.title}</h2>
                    {p.note && (
                      <p className="text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
                        {p.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border/40 pt-4 md:pt-0 md:border-0 md:col-span-4 md:grid md:grid-cols-4 md:items-baseline md:gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2 text-[11px] uppercase tracking-[0.28em] text-grey-soft md:text-[var(--grey)]">
                    <span className="text-[9px] opacity-50 md:hidden">Location</span>
                    <span>{p.location}</span>
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-1 text-[11px] uppercase tracking-[0.28em] text-grey-soft md:text-[var(--grey)]">
                    <span className="text-[9px] opacity-50 md:hidden">Size</span>
                    <span>{p.size}</span>
                  </div>
                  <div className="flex flex-col gap-1 ml-auto md:ml-0 md:col-span-1 font-serif text-base text-right md:text-right" style={{ color: "var(--gold)" }}>
                    <span className="text-[9px] font-sans uppercase tracking-[0.28em] text-grey-soft opacity-50 md:hidden text-right">Year</span>
                    <span>{p.year}</span>
                  </div>
                </div>
              </div>

              {p.images.length > 0 && (
                <div
                  className={`mt-10 grid gap-6 md:gap-8 ${
                    p.images.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {p.images.map((src, imgIdx) => (
                    <div
                      key={imgIdx}
                      onClick={() =>
                        setLightbox({
                          src,
                          title: p.title,
                          projectIndex: pIdx,
                          imageIndex: imgIdx,
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden border border-border/40 rounded-sm shadow-lg transition-all duration-500 hover:border-gold/60"
                      style={{ background: "var(--navy-deep)" }}
                    >
                      <img
                        src={src}
                        alt={`${p.title} — view ${imgIdx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="block h-auto w-full transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
                        style={{ borderTop: `4px solid ${d.color}` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded bg-black/80 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-cream backdrop-blur-sm border border-gold/40">
                          Click to Expand ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 md:p-8 backdrop-blur-md animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* Header */}
          <div className="flex w-full max-w-[1600px] items-center justify-between text-cream z-10" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{lightbox.title}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-grey-soft">
                View {lightbox.imageIndex + 1} of {d.projects[lightbox.projectIndex].images.length}
              </p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-cream transition-colors hover:bg-gold hover:text-black"
              aria-label="Close full view"
            >
              ✕
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative flex flex-1 items-center justify-center py-4 w-full" onClick={(e) => e.stopPropagation()}>
            {/* Prev button */}
            {lightbox.imageIndex > 0 && (
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-2 md:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-gold/40 text-gold transition-all hover:bg-gold hover:text-black hover:scale-110"
                aria-label="Previous image"
              >
                ←
              </button>
            )}

            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded shadow-2xl transition-transform duration-300"
            />

            {/* Next button */}
            {lightbox.imageIndex < d.projects[lightbox.projectIndex].images.length - 1 && (
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-2 md:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-gold/40 text-gold transition-all hover:bg-gold hover:text-black hover:scale-110"
                aria-label="Next image"
              >
                →
              </button>
            )}
          </div>

          {/* Footer controls */}
          <div className="text-[10px] uppercase tracking-[0.3em] text-grey-soft" onClick={(e) => e.stopPropagation()}>
            Use Arrow Keys ← → to navigate · Esc to close
          </div>
        </div>
      )}

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
