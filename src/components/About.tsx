import artImg from "@/assets/discipline-art.jpg";
import archImg from "@/assets/discipline-architecture.jpg";
import intImg from "@/assets/discipline-interiors.jpg";
import prodImg from "@/assets/discipline-products.jpg";

const disciplines = [
  {
    name: "art",
    img: artImg,
    copy: "Painting abstract stories in form and texture, our work echoes bold modernism. From art works to murals, we define your space with art that speaks.",
    tags: [],
  },
  {
    name: "architecture",
    img: archImg,
    copy: "",
    tags: ["Residential", "Industrial", "Institutional", "Hospitality", "Commercial", "Refurbishments"],
  },
  {
    name: "interiors",
    img: intImg,
    copy: "Elevate your space with minimalist design that blends curated materials and modern technology. Experience timeless harmony in every element, fostering a holistic and serene living.",
    tags: [],
  },
  {
    name: "products",
    img: prodImg,
    copy: "",
    tags: ["Furniture", "Lighting", "Decor", "Upholstery", "Furnishing", "Automation"],
  },
];

export function About() {
  return (
    <section id="studio" className="relative overflow-hidden py-24 md:py-32" style={{ background: "var(--charcoal, #2b2b2b)" }}>
      <span className="ghost-numeral absolute -left-4 top-10 text-[16vw] md:left-6">02</span>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Top: about us block */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          <div className="reveal md:col-span-5">
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none" style={{ color: "var(--gold)" }}>
              About the Studio
            </h2>
          </div>
          <div className="reveal reveal-delay-1 md:col-span-7 space-y-5 text-base font-light leading-relaxed" style={{ color: "var(--cream, #e8e2d4)" }}>
            <p>
              At PAPER AND PENCIL, we explore the realms of creativity to express our ideas, tailored to your aspirations.
              Grounded in minimalist, crisp geometries, our design language strikes a balance with functionality and timeless elegance.
            </p>
            <p>
              From architectural marvels to bespoke art pieces, every creation is a reflection of our unique design approach —{" "}
              <span style={{ color: "var(--gold)" }}>process, purpose and personality.</span>
            </p>
            <p>
              Whether creating spaces from the ground up or reimagining existing ones, let us shape your world.
            </p>
            <div className="mt-8">
              <a
                href="/PAPER AND PENCIL - Architecture & Interior Portfolio 2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                View Portfolio
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 h-px w-full" style={{ background: "var(--gold)" }} />

        {/* Disciplines grid */}
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d, i) => (
            <div key={d.name} className="reveal flex flex-col" style={{ animationDelay: `${i * 80}ms` }}>
              <h3 className="font-serif text-4xl lg:text-5xl" style={{ color: "var(--gold)" }}>
                {d.name}
              </h3>
              <div className="mt-6 aspect-[4/5] overflow-hidden bg-black/20">
                <img
                  src={d.img}
                  alt={`Paper & Pencil ${d.name} discipline — bespoke ${d.name} work by the Bengaluru studio`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover grayscale-[20%] transition-transform duration-[1200ms] hover:scale-105"
                />
              </div>
              {d.copy && (
                <p className="mt-6 text-sm font-light leading-relaxed" style={{ color: "var(--cream, #e8e2d4)" }}>
                  {d.copy}
                </p>
              )}
              {d.tags.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-light" style={{ color: "var(--cream, #e8e2d4)" }}>
                  {d.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="mt-20 space-y-3">
          <div className="flex items-center gap-5">
            <p className="font-serif text-2xl md:text-3xl whitespace-nowrap" style={{ color: "var(--cream, #e8e2d4)" }}>
              ಬೆಂಗಳೂರು <span style={{ color: "var(--gold)" }}>&amp;</span> beyond
            </p>
            <span className="flex-1 h-px" style={{ background: "var(--cream, #e8e2d4)" }} />
          </div>
          <div className="flex items-center gap-5">
            <span className="flex-1 h-px" style={{ background: "var(--cream, #e8e2d4)" }} />
            <p className="font-serif text-2xl md:text-3xl whitespace-nowrap" style={{ color: "var(--cream, #e8e2d4)" }}>
              ಕನಸಿನಿಂದ ಕಟ್ಟಡದವರೆಗೆ...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
