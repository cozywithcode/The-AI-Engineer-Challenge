import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Approved email addresses that are allowed to use the app.
 * Set APPROVED_EMAILS as a comma-separated list in .env, e.g.:
 *   APPROVED_EMAILS=alice@example.com,bob@example.com
 */
function getApprovedEmails(): Set<string> {
  const raw = process.env.APPROVED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const approved = getApprovedEmails();
      // If no approved emails configured, allow everyone (open mode)
      if (approved.size === 0) return true;
      const email = user.email?.toLowerCase() ?? "";
      if (!approved.has(email)) {
        return false; // blocks sign-in
      }
      return true;
    },
    async jwt({ token, account }) {
      // Persist the Google ID token so the backend can verify it
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose ID token to the client for backend API calls
      (session as any).id_token = token.id_token;
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
