import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    // This function handles requests to protected routes
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*"] };
