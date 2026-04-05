import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import '../globals.css';

/**
 * Admin Layout: The shell for the NovaxFolio dashboard.
 * - Protects all sub-pages with Next-Auth session checks.
 * - Provides a persistent sidebar with navigation to all CMS sections.
 * - Supports responsive layouts and theme-aware styling.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect to login if no active session is found
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-zinc-950 overflow-hidden font-sans">
      <AdminSidebar email={session.user?.email} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>
    </div>
  );
}
