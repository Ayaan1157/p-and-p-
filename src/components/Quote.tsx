import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function Quote() {
  return (
    <section className="relative py-28 md:py-40">
      <span className="ghost-numeral absolute left-1/2 top-10 -translate-x-1/2 text-[24vw]">"</span>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="reveal mb-16 text-center">
          <h2 className="font-serif text-[clamp(2.25rem,5vw,4.5rem)] leading-none">
            From The Other Side
          </h2>
        </div>
        <StaggerTestimonials />
      </div>
    </section>
  );
}
