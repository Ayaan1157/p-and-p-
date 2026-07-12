const steps = [
  { n: "01", title: "Discover", text: "We begin with a long, unhurried conversation to understand the brief beneath the brief." },
  { n: "02", title: "Conceptualize", text: "Concepts emerge on paper before pixels — proportion, light and material drawn by hand." },
  { n: "03", title: "Refine", text: "Drawings are refined to specification: every joint, finish and threshold detailed." },
  { n: "04", title: "Realize", text: "We remain on site through completion, attending to the final tenth of one percent." },
];

export function Process() {
  return (
    <section id="process" className="relative border-y py-32 md:py-44" style={{ borderColor: "var(--border)", background: "var(--navy-deep)" }}>
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">The Process</p>
          <h2 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]">
            A method, <span style={{ color: "var(--gold)" }}>not a formula.</span>
          </h2>
        </div>

        <ol className="mt-20 grid grid-cols-1 gap-px md:grid-cols-4" style={{ background: "var(--border)" }}>
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="reveal group relative overflow-hidden p-10 transition-all duration-700 ease-out hover:-translate-y-1 md:p-12"
              style={{ background: "var(--navy-deep)", transitionDelay: `${i * 120}ms` }}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
                style={{ background: "var(--gold)" }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--gold) 6%, transparent) 0%, transparent 60%)" }}
                aria-hidden="true"
              />
              <div className="font-serif text-sm transition-transform duration-500 group-hover:-translate-y-1" style={{ color: "var(--gold)" }}>{s.n}</div>
              <h3 className="mt-12 font-serif text-3xl transition-transform duration-500 group-hover:translate-x-1 md:text-4xl">{s.title}</h3>
              <p className="mt-5 text-sm font-light leading-relaxed transition-colors duration-500" style={{ color: "var(--grey-soft)" }}>{s.text}</p>
              <span className="mt-10 block h-px w-10 transition-all duration-700 ease-out group-hover:w-32" style={{ background: "var(--gold)" }} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
