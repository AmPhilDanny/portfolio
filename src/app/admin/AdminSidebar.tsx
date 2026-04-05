"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, LogOut, Briefcase, FileText, UserCircle, Star, Settings, Award, Code, FolderGit2, Home, Image as ImageIcon, Menu, X 
} from "lucide-react";

export function AdminSidebar({ email }: { email?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hero', href: '/admin/hero', icon: Home },
    { name: 'About', href: '/admin/about', icon: UserCircle },
    { name: 'Skills', href: '/admin/skills', icon: Code },
    { name: 'Services', href: '/admin/services', icon: Star },
    { name: 'Experience', href: '/admin/experience', icon: Briefcase },
    { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Certifications', href: '/admin/certifications', icon: Award },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Contact', href: '/admin/contact', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h2 className="text-xl font-bold font-sans text-gray-900 dark:text-white">NovaxFolio Admin</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-gray-800 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:block p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <h2 className="text-xl font-bold font-sans text-gray-900 dark:text-white">NovaxFolio Admin</h2>
          <p className="text-sm text-gray-500 mt-1 truncate">{email}</p>
        </div>

        <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
           <div className="overflow-hidden">
             <h2 className="text-lg font-bold font-sans text-gray-900 dark:text-white">Menu</h2>
             <p className="text-xs text-gray-500 mt-1 truncate">{email}</p>
           </div>
           <button 
             onClick={() => setIsOpen(false)}
             className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <Link 
            href="/api/auth/signout" 
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
