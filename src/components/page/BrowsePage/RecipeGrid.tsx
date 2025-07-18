"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { getRecipes } from "@/actions";
import RecipeCard from "@/components/page/BrowsePage/RecipeCard";

interface Recipe {
  id: string;
  name: string;
  timeInMinutes: number;
  image?: { url?: string | null; filename?: string | null } | null;
  approved: boolean;
  serves: number;
  createdAt: Date;
  updatedAt: Date;
  categories?: { id: string; name: string }[];
  tags?: string[];
}

export default function RecipeGrid({ pageSize }: { pageSize: number }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recipes", { pageSize, approved: true }],
      queryFn: async ({ pageParam = 1 }) =>
        getRecipes({ page: pageParam, pageSize, approved: true }),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
    });

  const loader = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {data?.pages.flatMap((page) =>
        page.recipes.map((recipe: Recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={{
              ...recipe,
              createdAt: recipe.createdAt?.toString(),
              updatedAt: recipe.updatedAt?.toString(),
              categories: recipe.categories ?? [],
              tags: recipe.tags ?? [],
            }}
          />
        ))
      )}
      <div ref={loader}>{isFetchingNextPage && "Loading more..."}</div>
    </div>
  );
}
