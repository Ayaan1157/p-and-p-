export function Footer() {
  return (
    <footer className="border-t pt-24 pb-12" style={{ borderColor: "var(--border)", background: "var(--navy-deep)" }}>
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-3 md:px-12">
        <div>
          <p className="font-serif text-3xl">Paper And Pencil</p>
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
            Drawn by hand in a quiet room in Bangalore.
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--gold)" }}>Studio</p>
          <ul className="mt-6 space-y-3 text-sm font-light" style={{ color: "var(--grey-soft)" }}>
            <li>#374, Winn Field Gardens</li>
            <li>Bengaluru, 560077</li>
            <li>By appointment</li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--gold)" }}>Elsewhere</p>
          <ul className="mt-6 space-y-3 text-sm font-light" style={{ color: "var(--grey-soft)" }}>
            <li><a href="#" className="link-underline">Instagram</a></li>
            <li><a href="#" className="link-underline">Journal</a></li>
            <li><a href="#" className="link-underline">Press</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-[1600px] flex-col items-start justify-between gap-4 border-t px-6 pt-8 text-[10px] uppercase tracking-[0.3em] md:flex-row md:items-center md:px-12" style={{ borderColor: "var(--border)", color: "var(--grey)" }}>
        <p>© {new Date().getFullYear()} Paper And Pencil. All rights reserved.</p>
        <p>Drawn with patience · London</p>
      </div>
    </footer>
  );
}
