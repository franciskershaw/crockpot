"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { getRecipes } from "@/actions";

// Minimal Recipe type for proof of concept
interface Recipe {
  id: string;
  name: string;
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
    <div>
      {data?.pages.flatMap((page) =>
        page.recipes.map((recipe: Recipe) => (
          <div className="text-3xl p-8" key={recipe.id}>
            {recipe.name}
          </div>
        ))
      )}
      <div ref={loader}>{isFetchingNextPage && "Loading more..."}</div>
    </div>
  );
}
