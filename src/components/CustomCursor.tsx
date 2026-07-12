import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const shadow = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    setEnabled(true);
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,input,textarea,[data-cursor='hover']");
      if (shadow.current) {
        shadow.current.style.width = interactive ? "120px" : "80px";
        shadow.current.style.height = interactive ? "120px" : "80px";
        shadow.current.style.opacity = interactive ? "0.35" : "0.22";
      }
    };
    const tick = () => {
      pos.x = target.x;
      pos.y = target.y;
      if (shadow.current) {
        shadow.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={shadow}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full md:block"
      style={{
        width: 80,
        height: 80,
        background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 55%, transparent) 0%, transparent 70%)",
        filter: "blur(14px)",
        opacity: 0.22,
        transition: "width 0.6s var(--ease-luxury), height 0.6s var(--ease-luxury), opacity 0.6s var(--ease-luxury)",
      }}
    />
  );
}
