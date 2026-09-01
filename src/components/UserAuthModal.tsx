import { useState } from "react";
import { useAppStore, type UserSession } from "@/lib/store";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserAuthModal({ isOpen, onClose, onSuccess }: UserAuthModalProps) {
  const { loginWithEmailPassword } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    loginWithEmailPassword(email, password, name);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-x-0 inset-y-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-sm border border-gold/40 bg-ink-soft p-8 shadow-2xl"
        style={{ background: "var(--navy-deep)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-cream">Sign In to Continue</h3>
          <button
            onClick={onClose}
            className="text-grey-soft hover:text-gold text-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-xs font-light leading-relaxed text-grey-soft">
          Please enter your details to submit a review or interact on Paper & Pencil.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Full Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
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
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
