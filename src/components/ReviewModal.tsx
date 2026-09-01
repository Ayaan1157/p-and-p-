import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { UserAuthModal } from "./UserAuthModal";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const { userSession, addReview, logoutUser } = useAppStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  if (!userSession) {
    return (
      <UserAuthModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          // Keep review modal open after sign in
        }}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonial.trim()) return;

    addReview({
      by: userSession.name,
      roleCompany: userSession.roleCompany || "Verified Client",
      email: userSession.email,
      rating,
      testimonial: testimonial.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTestimonial("");
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-sm border border-gold/40 bg-ink-soft p-8 shadow-2xl"
        style={{ background: "var(--navy-deep)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-cream">Write a Review</h3>
          <button onClick={onClose} className="text-grey-soft hover:text-gold text-lg" aria-label="Close modal">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="my-8 text-center py-6 space-y-3">
            <span className="text-3xl">✨</span>
            <h4 className="font-serif text-xl text-gold">Thank You for Your Feedback!</h4>
            <p className="text-xs text-grey-soft max-w-sm mx-auto leading-relaxed">
              Your review has been submitted and sent to the admin team for approval. It will appear on the website shortly after review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs">
              <span className="text-grey-soft">
                Signed in as <strong className="text-cream">{userSession.name}</strong> ({userSession.email})
              </span>
              <button
                type="button"
                onClick={() => logoutUser()}
                className="text-[10px] uppercase tracking-wider text-gold hover:underline"
              >
                Switch Account
              </button>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-gold transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={22}
                      className={star <= rating ? "fill-gold text-gold" : "text-grey-soft/40"}
                    />
                  </button>
                ))}
                <span className="ml-3 text-xs text-grey-soft">{rating} of 5 stars</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-2">Your Experience & Feedback</label>
              <textarea
                required
                rows={4}
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Share your experience working with Paper & Pencil on your project..."
                className="w-full border border-border bg-ink p-3 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-[0.25em] text-grey-soft hover:text-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-gold bg-gold/10 px-6 py-2.5 text-xs uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-black"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
