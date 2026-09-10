import { useState } from "react";
import { useAppStore, type UserSession } from "@/lib/store";
import { Lock, UserPlus } from "lucide-react";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserAuthModal({ isOpen, onClose, onSuccess }: UserAuthModalProps) {
  const { registerUser, signInUser } = useAppStore();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError(null);
  };

  const switchMode = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return;

    const result = signInUser(email, password);
    if (!result.success) {
      setError(result.error || "Sign in failed.");
      return;
    }
    resetForm();
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password || !name.trim()) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = registerUser(email, password, name);
    if (!result.success) {
      setError(result.error || "Registration failed.");
      return;
    }
    resetForm();
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
        {/* Tabs */}
        <div className="flex border-b border-border/60 mb-6">
          <button
            onClick={() => switchMode("signin")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-[0.25em] border-b-2 transition-colors ${
              authMode === "signin"
                ? "border-gold text-gold font-medium"
                : "border-transparent text-grey-soft hover:text-cream"
            }`}
          >
            <Lock size={14} /> Sign In
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-[0.25em] border-b-2 transition-colors ${
              authMode === "signup"
                ? "border-gold text-gold font-medium"
                : "border-transparent text-grey-soft hover:text-cream"
            }`}
          >
            <UserPlus size={14} /> Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 border border-red-800/60 bg-red-950/30 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {authMode === "signin" ? (
          <>
            <p className="text-xs leading-relaxed text-grey-soft mb-5">
              Enter your email and password to continue.
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
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
                  Sign In
                </button>
              </div>
            </form>
            <p className="mt-5 text-center text-[11px] text-grey-soft">
              Don't have an account?{" "}
              <button onClick={() => switchMode("signup")} className="text-gold hover:underline">
                Create one →
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="text-xs leading-relaxed text-grey-soft mb-5">
              Create an account to submit reviews and interact.
            </p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                />
              </div>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.28em] text-gold mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border bg-ink px-4 py-2.5 text-sm text-cream placeholder:text-grey/40 focus:border-gold focus:outline-none"
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
                  Create Account
                </button>
              </div>
            </form>
            <p className="mt-5 text-center text-[11px] text-grey-soft">
              Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="text-gold hover:underline">
                Sign in →
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
