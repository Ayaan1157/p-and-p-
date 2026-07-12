import { useEffect, useMemo, useRef } from "react";

const FRAME_COUNT = 120;
const FPS = 60;

export function ScrollVideo() {
  const baseFrameRef = useRef<HTMLImageElement>(null);
  const cacheRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));

  const frameSources = useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, index) => {
        const frameNumber = String(index + 1).padStart(3, "0");
        return `/scroll-house-frames/frame-${frameNumber}.jpg`;
      }),
    [],
  );

  // Preload all frames
  useEffect(() => {
    frameSources.forEach((src, i) => {
      if (cacheRef.current[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      cacheRef.current[i] = img;
    });
  }, [frameSources]);

  // Autoplay loop
  useEffect(() => {
    const frameInterval = 1000 / FPS;
    let raf: number;
    let last = performance.now();
    let index = 0;

    const tick = (now: number) => {
      if (now - last >= frameInterval) {
        last = now;
        const img = baseFrameRef.current;
        if (img) img.src = frameSources[index];
        index = (index + 1) % FRAME_COUNT;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frameSources]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink font-serif">
      <img
        ref={baseFrameRef}
        src={frameSources[0]}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "translateZ(0)" }}
      />

      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink/60 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p
          className="mb-8 text-gold animate-[fadeUp_1.2s_ease-out_0.2s_both]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(0.7rem,1vw,0.85rem)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}
        >
          Bengaluru · Architecture · Interiors · Art
        </p>

        <h2
          className="font-serif leading-[1] tracking-tight text-cream animate-[fadeUp_1.4s_ease-out_0.5s_both]"
          style={{ fontSize: "clamp(2.75rem,8vw,7rem)" }}
        >
          We are Paper and Pencil
        </h2>

        <p
          className="mt-8 max-w-3xl font-light text-cream animate-[fadeUp_1.4s_ease-out_0.9s_both]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.25rem,2.6vw,2.25rem)",
            lineHeight: 1.3,
          }}
        >
          A studio of drawing, listening, and making — where every line carries
          intention and every space tells a story worth inhabiting.
        </p>

        <p
          className="mt-10 max-w-2xl text-cream/80 animate-[fadeUp_1.4s_ease-out_1.3s_both]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(0.95rem,1.4vw,1.15rem)",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          We design with patience and craft with conviction — shaping
          architecture, interiors, and art that honour place, people, and the
          quiet poetry of the everyday.
        </p>

        <div className="mt-12 h-px w-24 bg-gold/60 animate-[fadeUp_1.4s_ease-out_1.7s_both]" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
