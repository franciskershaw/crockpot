import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, Permission } from "@/lib/action-helpers";
import { getUserRecipeCount } from "@/data/recipes/getUserRecipeCount";
import { UserRole } from "@/data/types";
import { Suspense } from "react";
import CreateRecipeFormLoader from "./components/CreateRecipeFormLoader";
import CreateRecipeFormSkeleton from "./components/CreateRecipeFormSkeleton";

export default async function NewRecipePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Double-check permission on the server side
  const userRole = session.user.role;
  if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
    redirect("/your-crockpot");
  }

  // Check recipe limit before loading the form
  const userRecipeCount = await getUserRecipeCount(session.user.id);
  const hasReachedLimit =
    (userRole === UserRole.FREE && userRecipeCount >= 5) ||
    (userRole === UserRole.PREMIUM && userRecipeCount >= 10);

  if (hasReachedLimit) {
    redirect("/your-crockpot");
  }

  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Create New Recipe
        </h1>
        <p className="text-gray-600 mt-2">
          Share your culinary creation with the community
        </p>
      </div>

      <Suspense fallback={<CreateRecipeFormSkeleton />}>
        <CreateRecipeFormLoader />
      </Suspense>
    </div>
  );
}
