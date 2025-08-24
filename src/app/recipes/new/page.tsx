import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, Permission } from "@/lib/action-helpers";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Double-check permission on the server side
  const userRole = session.user.role;
  if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
    redirect("/your-crockpot?error=premium-required");
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Create New Recipe
        </h1>
        <p className="text-gray-600 mt-2">
          Share your culinary creation with the community
        </p>
      </div>
    </div>
  );
}
