import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminNavigation from "./components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { hasPermission, Permission } from "@/lib/action-helpers";
import { UserRole } from "@/data/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and has ADMIN role
  if (!hasPermission(session?.user?.role as UserRole, Permission.ADMIN_PANEL)) {
    redirect("/not-found");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back to main app */}
        <div className="mb-4">
          <Link href="/your-crockpot">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </div>

        <AdminNavigation />
        <div className="bg-white rounded-lg border p-6">{children}</div>
      </div>
    </div>
  );
}
