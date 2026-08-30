import { useEffect, useState } from "react";
// import logo from "@/assets/logo.png.asset.json";



export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-700"
        style={{
          background: scrolled || isOpen ? "color-mix(in oklab, var(--ink) 88%, transparent)" : "transparent",
          backdropFilter: scrolled || isOpen ? "blur(14px)" : "none",
          borderBottom: scrolled || isOpen ? "1px solid var(--border)" : "1px solid transparent",
          padding: scrolled ? "0.85rem 0" : "1.75rem 0",
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a href="/" aria-label="Paper and Pencil — home" className="leading-none">
            <img
              src="/LOGO_transparent.png"
              alt="Paper and Pencil"
              width={320}
              height={80}
              className="h-12 w-auto object-contain md:h-14"
            />
          </a>
          
          <nav className="hidden gap-10 text-xs uppercase tracking-[0.28em] text-grey-soft md:flex">
            <a className="link-underline" href="/#studio">Studio</a>
            <a className="link-underline" href="/#services">Services</a>
            <a className="link-underline" href="/#projects">Projects</a>
            <a className="link-underline" href="/#process">Process</a>
            <a className="link-underline" href="/#footer">Contact</a>
          </nav>
          
          <a href="/#contact" className="hidden text-xs uppercase tracking-[0.28em] md:inline-flex" style={{ color: "var(--gold)" }}>
            <span className="link-underline">Enquire →</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-grey-soft hover:text-gold md:hidden focus:outline-none"
          >
            <span
              className={`block h-[1px] w-6 bg-current transition-all duration-300 ease-out ${
                isOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-[1px] w-6 bg-current transition-all duration-300 ease-out ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[1px] w-6 bg-current transition-all duration-300 ease-out ${
                isOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile navigation slide-over menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink/65 backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-luxury)] md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed bottom-0 right-0 top-0 z-40 w-[290px] bg-ink-soft/95 backdrop-blur-2xl border-l border-border/60 p-8 flex flex-col justify-between transition-transform duration-500 ease-[var(--ease-luxury)] md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8 mt-24 text-sm uppercase tracking-[0.28em] text-grey-soft">
          <a className="link-underline w-fit" href="/#studio" onClick={() => setIsOpen(false)}>Studio</a>
          <a className="link-underline w-fit" href="/#services" onClick={() => setIsOpen(false)}>Services</a>
          <a className="link-underline w-fit" href="/#projects" onClick={() => setIsOpen(false)}>Projects</a>
          <a className="link-underline w-fit" href="/#process" onClick={() => setIsOpen(false)}>Process</a>
          <a className="link-underline w-fit" href="/#footer" onClick={() => setIsOpen(false)}>Contact</a>
        </div>

        <div className="text-sm uppercase tracking-[0.28em] mb-6">
          <a href="/#contact" onClick={() => setIsOpen(false)} style={{ color: "var(--gold)" }}>
            <span className="link-underline">Enquire →</span>
          </a>
        </div>
      </div>
    </>
  );
}

