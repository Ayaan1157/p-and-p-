import { useState } from "react";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative border-t py-32 md:py-44" style={{ borderColor: "var(--border)" }}>
      <span className="ghost-numeral absolute right-4 top-10 text-[18vw] md:right-12">04</span>
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-24 md:px-12">
        <div className="md:col-span-5">
          <p className="reveal eyebrow">Begin a conversation</p>
          <h2 className="reveal reveal-delay-1 mt-6 font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]">
            Tell us about <span style={{ color: "var(--gold)" }}>your space.</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-8 max-w-md text-base font-light leading-relaxed" style={{ color: "var(--grey-soft)" }}>
            Give us a chance to bring your aspiration to life. Share a few words about your space and we'll be in touch.
          </p>
          <div className="reveal reveal-delay-3 mt-12 space-y-2 text-sm font-light" style={{ color: "var(--grey-soft)" }}>
            <p>studio.paperandpencil@gmail.com</p>
            <p>+91 99868 21371</p>
          </div>

        </div>

        <form
          className="reveal reveal-delay-2 md:col-span-7"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--grey)" }}>Name</label>
              <input id="contact-name" name="name" className="field-line" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--grey)" }}>Email</label>
              <input id="contact-email" name="email" type="email" className="field-line" placeholder="you@studio.com" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact-project" className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--grey)" }}>Project type</label>
              <input id="contact-project" name="project" className="field-line" placeholder="Hospitality, residence, retail…" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact-message" className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--grey)" }}>A few words</label>
              <textarea id="contact-message" name="message" rows={4} className="field-line resize-none" placeholder="Tell us a little about the place." />
            </div>
          </div>
          <button
            type="submit"
            className="group mt-12 inline-flex items-center gap-4 border px-8 py-4 text-xs uppercase tracking-[0.32em] transition-colors duration-500"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            data-cursor="hover"
          >
            {sent ? "Thank you" : "Send enquiry"}
            <span className="block h-px w-6 transition-all duration-500 group-hover:w-12" style={{ background: "var(--gold)" }} />
          </button>
        </form>
      </div>
    </section>
  );
}
