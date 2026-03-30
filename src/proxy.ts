import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    // Protected routes handler
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };
