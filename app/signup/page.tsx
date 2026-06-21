"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { SignupBody, ApiResponse } from "@/types/auth";

// ── Constants ────────────────────────────────────────────────────────────────

const POPULAR_GAMES = [
  "BGMI", "PUBG", "Valorant", "Free Fire", "COD Mobile",
  "Apex Legends", "Fortnite", "CS2", "Minecraft", "GTA V",
];

type Platform = "PC" | "Console" | "Mobile";

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: "PC",      label: "PC",      icon: "🖥️" },
  { value: "Console", label: "Console", icon: "🎮" },
  { value: "Mobile",  label: "Mobile",  icon: "📱" },
];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

// ── Types ────────────────────────────────────────────────────────────────────

type FormFields = "email" | "username" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FormFields, string>>;

// ── Password strength helper ──────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) || /[^a-zA-Z0-9]/.test(pw)) score++;
  if (score === 1) return { score: 1, label: "Weak",   color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Fair",   color: "#f59e0b" };
  return              { score: 3, label: "Strong", color: "#22c55e" };
}

// ── Platform chip selector ────────────────────────────────────────────────────

function PlatformSelector({
  selected,
  onChange,
}: {
  selected: Platform[];
  onChange: (p: Platform[]) => void;
}) {
  const toggle = (p: Platform) =>
    onChange(selected.includes(p) ? selected.filter((x) => x !== p) : [...selected, p]);

  return (
    <div className="flex gap-3 mt-1">
      {PLATFORMS.map(({ value, label, icon }) => {
        const active = selected.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[6px] border text-xs font-sora font-semibold transition-all duration-200 ${
              active
                ? "bg-[#C47C2B]/15 border-[#C47C2B] text-[#E8A44A] shadow-[0_0_12px_rgba(196,124,43,0.2)]"
                : "bg-[#0F0A06] border-[#2A1F15] text-[#5A4A3A] hover:border-[#7C4A1E] hover:text-[#C47C2B]"
            }`}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span>{label}</span>
            {active && (
              <span className="w-4 h-4 rounded-full bg-[#C47C2B] flex items-center justify-center text-[#0A0705] text-[10px] font-bold">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Game tag selector ─────────────────────────────────────────────────────────

function GameTagSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (g: string[]) => void;
}) {
  const toggle = (game: string) =>
    onChange(selected.includes(game) ? selected.filter((g) => g !== game) : [...selected, game]);

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {POPULAR_GAMES.map((game) => (
        <button
          key={game}
          type="button"
          onClick={() => toggle(game)}
          className={`px-3 py-1.5 rounded-[4px] text-xs font-sora font-semibold transition-all duration-200 border ${
            selected.includes(game)
              ? "bg-[#C47C2B] text-[#0A0705] border-[#C47C2B]"
              : "bg-transparent text-[#7A6A55] border-[#2A1F15] hover:border-[#C47C2B] hover:text-[#C47C2B]"
          }`}
        >
          {game}
        </button>
      ))}
    </div>
  );
}

// ── Field component ───────────────────────────────────────────────────────────

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  hint,
  badge,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="font-sora text-xs text-[#7A6A55] tracking-wider uppercase">
          {label}
        </label>
        {badge}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full bg-[#0F0A06] border rounded-[4px] px-4 py-3 font-inter text-sm text-[#F5ECD7] placeholder-[#3A2F25] outline-none transition-all duration-200 focus:shadow-[0_0_12px_rgba(196,124,43,0.15)] ${
          error
            ? "border-red-500/60 focus:border-red-500/80"
            : "border-[#2A1F15] focus:border-[#C47C2B]"
        }`}
      />
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="font-sora text-xs text-red-400 flex items-center gap-1"
          >
            <span className="text-red-500">⚠</span> {error}
          </motion.span>
        ) : hint ? (
          <motion.span
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sora text-xs text-[#5A4A3A]"
          >
            {hint}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ── Main signup page ──────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwStrength = getPasswordStrength(form.password);

  // ── Per-field validation (runs on blur) ──────────────────────────────────────

  const validateField = useCallback((name: FormFields, value: string) => {
    let msg = "";
    switch (name) {
      case "email":
        if (!value.trim()) msg = "Email address is required.";
        else if (!EMAIL_REGEX.test(value.trim())) msg = "Please enter a valid email address.";
        break;
      case "username":
        if (!value.trim()) msg = "Username is required.";
        else if (value.trim().length < 3) msg = "Must be at least 3 characters.";
        else if (value.trim().length > 32) msg = "Must be 32 characters or fewer.";
        else if (!USERNAME_REGEX.test(value.trim()))
          msg = "Only letters, numbers, _ . - allowed.";
        break;
      case "password":
        if (!value) msg = "Password is required.";
        else if (value.length < 8) msg = "Must be at least 8 characters.";
        break;
      case "confirmPassword":
        if (!value) msg = "Please confirm your password.";
        else if (value !== form.password) msg = "Passwords do not match.";
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: msg || undefined }));
    return !msg;
  }, [form.password]);

  // ── Full form validation on submit ───────────────────────────────────────────

  function validateAll(): boolean {
    const fields = ["email", "username", "password", "confirmPassword"] as FormFields[];
    const results = fields.map((f) => validateField(f, form[f]));
    return results.every(Boolean);
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");
    if (!validateAll()) return;

    setLoading(true);
    try {
      const body: SignupBody = {
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        favoriteGames,
        platforms,
      };

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: ApiResponse & { field?: string } = await res.json();

      if (!data.success) {
        // If the server identifies which field caused the error, highlight it
        if (data.field) {
          setFieldErrors((prev) => ({ ...prev, [data.field!]: data.message }));
        } else {
          setGlobalError(data.message);
        }
        return;
      }

      router.push(`/verify-pending?email=${encodeURIComponent(form.email.trim())}`);
    } catch {
      setGlobalError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const blur = (key: FormFields) => () => validateField(key, form[key]);

  // ── UI ────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#7C4A1E] blur-[140px] rounded-full pointer-events-none"
        style={{ opacity: 0.12 }}
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="fixed bottom-[-200px] left-[-150px] w-[400px] h-[400px] bg-[#7C4A1E] blur-[120px] rounded-full pointer-events-none"
        style={{ opacity: 0.07 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[500px]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block font-bebas text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] hover:opacity-80 transition-opacity">
            Albus Universe
          </a>
          <h1 className="font-bebas text-5xl text-[#F5ECD7] mt-1 tracking-wide leading-tight">
            Create Account
          </h1>
          <p className="font-sora text-xs text-[#7A6A55] mt-2">
            Already have one?{" "}
            <a href="/login" className="text-[#C47C2B] hover:text-[#E8A44A] transition-colors">
              Log in
            </a>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#110B0780] backdrop-blur-xl border border-white/5 rounded-[8px] p-8 flex flex-col gap-6">

          {/* Global error */}
          <AnimatePresence>
            {globalError && (
              <motion.div
                key="global-err"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="bg-red-500/10 border border-red-500/30 rounded-[4px] px-4 py-3 flex items-start gap-3"
              >
                <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
                <span className="font-sora text-sm text-red-400 leading-relaxed">{globalError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <Field
              label="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              onBlur={blur("email")}
              error={fieldErrors.email}
              placeholder="you@example.com"
            />

            {/* Username */}
            <Field
              label="Username"
              id="username"
              value={form.username}
              onChange={set("username")}
              onBlur={blur("username")}
              error={fieldErrors.username}
              placeholder="your_gamertag"
              hint="Letters, numbers, _ . - only"
            />

            {/* Password + strength */}
            <div className="flex flex-col gap-1.5">
              <Field
                label="Password"
                id="password"
                type="password"
                value={form.password}
                onChange={set("password")}
                onBlur={blur("password")}
                error={fieldErrors.password}
                placeholder="At least 8 characters"
                badge={
                  form.password ? (
                    <span
                      className="text-[10px] font-sora font-semibold px-2 py-0.5 rounded-full border"
                      style={{ color: pwStrength.color, borderColor: pwStrength.color + "44" }}
                    >
                      {pwStrength.label}
                    </span>
                  ) : undefined
                }
              />
              {/* Strength bar */}
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i <= pwStrength.score ? pwStrength.color : "#2A1F15",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <Field
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              onBlur={blur("confirmPassword")}
              error={fieldErrors.confirmPassword}
              placeholder="Repeat your password"
            />

            {/* Platform multi-select */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-sora text-xs text-[#7A6A55] tracking-wider uppercase">
                  Platform
                </span>
                <span className="font-sora text-[10px] text-[#3A2F25]">
                  Optional · select all that apply
                </span>
              </div>
              <PlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>

            {/* Favorite games */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-sora text-xs text-[#7A6A55] tracking-wider uppercase">
                  Favorite Games
                </span>
                <span className="font-sora text-[10px] text-[#3A2F25]">
                  Optional · pick as many as you want
                </span>
              </div>
              <GameTagSelector selected={favoriteGames} onChange={setFavoriteGames} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 font-sora font-semibold text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] hover:shadow-[0_0_20px_rgba(232,164,74,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-[4px] px-6 py-3.5 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>

          </form>
        </div>

        <p className="text-center font-sora text-[11px] text-[#3A2F25] mt-5">
          By creating an account you agree to our{" "}
          <a href="#" className="text-[#5A4A3A] hover:text-[#C47C2B] transition-colors">Terms</a>
          {" & "}
          <a href="#" className="text-[#5A4A3A] hover:text-[#C47C2B] transition-colors">Privacy Policy</a>.
        </p>
      </motion.div>
    </main>
  );
}
