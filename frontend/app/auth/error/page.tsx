"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const message =
    error === "AccessDenied"
      ? "Your email is not on the approved list. Contact the admin for access."
      : "Something went wrong during sign-in. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-forest-dappled/20 p-10 shadow-2xl"
        style={{
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <h1
          className="text-3xl font-semibold tracking-tight text-forest-sunlight"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          access denied
        </h1>
        <p className="text-center text-sm text-forest-sunlight/70">
          {message}
        </p>
        <a
          href="/"
          className="rounded-xl border border-forest-dappled/30 bg-white/10 px-5 py-3 text-sm font-medium text-forest-sunlight transition-colors hover:bg-white/20"
        >
          Back to sign in
        </a>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
