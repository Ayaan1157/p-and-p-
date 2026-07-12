import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { CustomCursor } from "@/components/CustomCursor";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";


import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Process } from "@/components/Process";
import { Quote } from "@/components/Quote";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Paper & Pencil — Interior Architecture Studio, Bengaluru",
    meta: [
      { name: "description", content: "Bengaluru interior architecture studio crafting considered residential, commercial, industrial and institutional spaces across India." },
      { property: "og:title", content: "Paper & Pencil — Interior Architecture Studio, Bengaluru" },
      { property: "og:description", content: "Considered interiors and architecture for residence, commerce, industry and institutions — drawn by hand from a quiet studio in Bengaluru." },
      { property: "og:url", content: "https://velvet-folio-lab.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://velvet-folio-lab.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Paper & Pencil",
          description: "Bengaluru interior architecture studio designing considered residential, commercial, industrial and institutional spaces.",
          url: "https://velvet-folio-lab.lovable.app/",
          areaServed: "India",
          address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="relative">
      <CustomCursor />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Process />
      <Quote />
      <Contact />
      <Footer />
    </main>
  );
}
