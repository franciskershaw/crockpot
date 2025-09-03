import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@/data/types";
import AdminNavigation from "./components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and has ADMIN role
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/");
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
        {children}
      </div>
    </div>
  );
}
