"use client";

import { useState } from "react";
import { initializeDatabase } from "@/app/actions/init";
import { Database01Icon as Database, Loading02Icon as Loader2, TickDouble01Icon as CheckCircle } from "hugeicons-react";

export default function InitDatabaseButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleInit = async () => {
    if (!confirm("This will populate all tables with professional default content if they are empty. Proceed?")) return;
    
    setLoading(true);
    const result = await initializeDatabase();
    setLoading(false);
    
    if (result.success) {
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } else {
      alert(`Initialization failed: ${result.error || "Unknown error"}. Check server logs for details.`);
    }
  };

  return (
    <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Initialize Database</h3>
          <p className="text-sm text-muted-foreground">Populate your portfolio with professional defaults to see what's editable.</p>
        </div>
      </div>
      
      <button
        onClick={handleInit}
        disabled={loading || done}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : done ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Database className="w-5 h-5" />
        )}
        {loading ? "Initializing..." : done ? "Initialized Successfully!" : "Initialize with Defaults"}
      </button>
    </div>
  );
}
