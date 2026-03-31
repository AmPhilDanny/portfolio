import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Admin Dashboard Page: The entry point for the NovaxFolio CMS.
 * Provides a quick overview of the system status and direct links 
 * to primary management tasks like Hero and Project updates.
 */
export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold font-sans text-gray-900 dark:text-white mb-8">
        Welcome back, {session?.user?.name || 'Admin'}
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* QUICKS START: Direct links to common tasks */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">NovaxFolio Quick Start</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Use the sidebar to navigate and manage different sections of your portfolio. Changes will instantly be reflected in the database and visible on the deployed live site.
          </p>

          <div className="space-y-3">
             <Link href="/admin/hero" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
               <span className="font-medium text-gray-900 dark:text-white">Edit Hero Details</span>
               <ArrowRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link href="/admin/projects" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
               <span className="font-medium text-gray-900 dark:text-white">Manage Projects</span>
               <ArrowRight className="w-4 h-4 text-gray-400" />
             </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h2>
          <ul className="space-y-4">
             <li className="flex items-center justify-between">
               <span className="text-gray-600 dark:text-gray-400">Database Connection</span>
               <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">PostgreSQL Secure</span>
             </li>
             <li className="flex items-center justify-between">
               <span className="text-gray-600 dark:text-gray-400">Authentication</span>
               <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">NextAuth Secure</span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
