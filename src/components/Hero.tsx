import { useEffect, useRef } from "react";
// import heroVideo from "@/assets/hero-bg.mp4.asset.json";


export function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      if (!imgRef.current) return;
      const y = window.scrollY;
      if (y > window.innerHeight) return; // stop work once hero is off-screen
      imgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y * 0.0004})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="relative isolate h-screen min-h-[720px] w-full overflow-hidden">
      <div ref={imgRef} className="absolute inset-0 -z-10 will-change-transform">
        <video
          src="/Modern_house_in_foggy_forest_202605310148 (online-video-cutter.com).mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--navy-deep) 35%, transparent) 0%, color-mix(in oklab, var(--navy) 25%, transparent) 40%, color-mix(in oklab, var(--ink) 60%, transparent) 80%, color-mix(in oklab, var(--ink) 90%, transparent) 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
      </div>

      {/* Ghost numeral */}
      <div className="ghost-numeral absolute right-4 top-24 select-none text-[22vw] md:right-12 md:top-32">01</div>

      <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-28 md:px-12 md:pb-32">
        <p className="hero-fade eyebrow" style={{ animationDelay: "0.1s" }}>Est 2020</p>
        <h1 className="mt-6 font-serif text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-tight">
          <span className="sr-only">Paper & Pencil — Interior Architecture Studio. </span>
          <span className="hero-fade block" style={{ animationDelay: "0.25s" }} aria-hidden="true">Spaces curated</span>
          <span className="hero-fade block text-grey-soft" style={{ animationDelay: "0.45s", color: "var(--dust)" }} aria-hidden="true">
            with patience<span className="animate-blink ml-1 inline-block font-light">|</span>
          </span>
        </h1>
        <div className="hero-fade mt-10 flex max-w-3xl items-end justify-between gap-8" style={{ animationDelay: "0.65s" }}>
          <p className="max-w-md text-base font-light leading-relaxed text-grey-soft" style={{ color: "var(--dust)" }}>
            Creative studio
          </p>
          <a href="#projects" className="link-underline hidden text-xs uppercase tracking-[0.3em] md:inline-block" style={{ color: "var(--gold)" }}>
            View work →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--grey)" }}>Scroll</span>
        <span className="block h-14 w-px origin-top animate-scroll-line" style={{ background: "var(--gold)" }} />
      </div>
    </section>
  );
}
