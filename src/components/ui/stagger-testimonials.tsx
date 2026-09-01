import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { ReviewModal } from "@/components/ReviewModal";

export interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
}

interface CardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const Card: React.FC<CardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;
  const absPos = Math.abs(position);
  // Hide anything beyond the 2 nearest neighbors so nothing overlaps the center card.
  const hidden = absPos > 2;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer p-8 transition-all duration-700 ease-in-out flex flex-col justify-between",
        isCenter ? "z-20" : "z-0",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        background: isCenter ? "var(--gold, #b48b57)" : "rgba(20,20,22,0.85)",
        color: isCenter ? "#1a1a1a" : "var(--cream, #e8e2d4)",
        border: isCenter
          ? "1px solid var(--gold, #b48b57)"
          : "1px solid rgba(232,226,212,0.12)",
        backdropFilter: isCenter ? "none" : "blur(6px)",
        clipPath:
          "polygon(32px 0%, calc(100% - 32px) 0%, 100% 32px, 100% 100%, calc(100% - 32px) 100%, 32px 100%, 0 100%, 0 0)",
        transform: `translate(-50%, -50%) translateX(${(cardSize * 1.05) * position}px) translateY(${
          isCenter ? -40 : absPos * 10
        }px) rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)`,
        opacity: hidden ? 0 : isCenter ? 1 : Math.max(0.35, 1 - absPos * 0.28),
        pointerEvents: hidden ? "none" : "auto",
        boxShadow: isCenter
          ? "0 30px 60px -30px rgba(0,0,0,0.7)"
          : "0 10px 30px -20px rgba(0,0,0,0.5)",
      }}
    >
      <p
        className="font-serif leading-snug"
        style={{ fontSize: cardSize > 320 ? "1.35rem" : "1.05rem" }}
      >
        “{testimonial.testimonial}”
      </p>
      <p
        className="mt-6 text-[10px] uppercase tracking-[0.32em]"
        style={{ opacity: isCenter ? 0.7 : 0.6 }}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const { approvedReviews } = useAppStore();
  const [cardSize, setCardSize] = useState(360);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Convert approved dynamic reviews from store to Testimonial interface format
  const formattedItems: Testimonial[] = approvedReviews.map((r, i) => ({
    tempId: i,
    testimonial: r.testimonial,
    by: `${r.by}${r.roleCompany ? ` · ${r.roleCompany}` : ""}`,
  }));

  const [list, setList] = useState<Testimonial[]>(formattedItems);

  useEffect(() => {
    setList(formattedItems);
  }, [approvedReviews]);

  const handleMove = (steps: number) => {
    if (list.length === 0) return;
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardSize(360);
      else if (w >= 640) setCardSize(300);
      else setCardSize(Math.min(300, w - 48));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: cardSize + 180 }}
      >
        {list.map((t, index) => {
          const position =
            list.length % 2
              ? index - (list.length + 1) / 2
              : index - list.length / 2;
          return (
            <Card
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-4 z-30">
          <button
            onClick={() => handleMove(-1)}
            aria-label="Previous"
            className="flex h-12 w-12 items-center justify-center border transition-colors duration-500 hover:bg-[var(--gold)] hover:text-black"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleMove(1)}
            aria-label="Next"
            className="flex h-12 w-12 items-center justify-center border transition-colors duration-500 hover:bg-[var(--gold)] hover:text-black"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="mt-8 z-30">
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="group inline-flex items-center gap-3 border border-gold/60 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.28em] text-gold transition-all duration-500 hover:bg-gold hover:text-black"
        >
          <PenTool size={14} /> Write a Review
        </button>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

