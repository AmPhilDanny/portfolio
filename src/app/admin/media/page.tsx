import MediaManager from "./MediaManager";

export const metadata = {
  title: "Media Manager | Admin",
  description: "Manage your portfolio media assets",
};

/**
 * MediaPage: Dedicated administrative view for asset management.
 * Provides a full-screen interface to browse, search, and upload 
 * binary files to Octo-Storage.
 */
export default function MediaPage() {
  return <MediaManager />;
}

