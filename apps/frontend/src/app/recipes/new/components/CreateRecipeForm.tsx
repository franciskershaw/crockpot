"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, Users } from "lucide-react";
import { useForm } from "react-hook-form";

import useGetItems from "@/app/items/hooks/useGetItems";
import useCreateRecipe from "@/app/recipes/hooks/useCreateRecipe";
import useGetRecipeCategories from "@/app/recipes/hooks/useGetRecipeCategories";
import useGetUserRecipeCount from "@/app/recipes/hooks/useGetUserRecipeCount";
import useUpdateRecipe from "@/app/recipes/hooks/useUpdateRecipe";
import useUploadImage from "@/app/recipes/hooks/useUploadImage";
import useGetUnits from "@/app/units/hooks/useGetUnits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/user/useUser";
import { hasPermission } from "@/lib/utils";
import { createRecipeSchema, type CreateRecipeInput } from "@/lib/validations";
import {
  Permission,
  RecipeCategory,
  Unit,
  UserRole,
  type Recipe,
} from "@/shared/types";

import {
  transformNotesForTextarea,
  transformTextareaToNotes,
} from "../helpers/recipe-form-helpers";

import CreateRecipeFormSkeleton from "./CreateRecipeFormSkeleton";
import ImageUpload from "./ImageUpload";
import IngredientManager, { type IngredientItem } from "./IngredientManager";
import Instructions, { type Instruction } from "./Instructions";
import RecipeName from "./RecipeName";

interface CreateRecipeFormProps {
  recipe?: Recipe; // Optional - if provided, we're editing
}

const CreateRecipeForm = ({ recipe }: CreateRecipeFormProps) => {
  const router = useRouter();
  const { user, fetchingUser } = useUser();

  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe?.image?.url || null
  );

  // Determine if we're editing or creating
  const isEditing = !!recipe;

  // Fetch reference data client-side
  const { categories: recipeCategories = [], isLoading: categoriesLoading } =
    useGetRecipeCategories();
  const { items: ingredients = [], isLoading: itemsLoading } =
    useGetItems("ingredients");
  const { units = [], isLoading: unitsLoading } = useGetUnits();
  const { recipeCount, isLoading: countLoading } = useGetUserRecipeCount();

  // Mutations
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const { uploadImage, isUploading: isUploadingImage } = useUploadImage();

  // Track the selected image file (not just preview)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Initialize ingredients from recipe if editing
  const getInitialIngredients = (): IngredientItem[] => {
    if (!recipe?.ingredients || !ingredients.length) return [];

    return recipe.ingredients.map((ing) => {
      const itemId =
        typeof ing.itemId === "string" ? ing.itemId : ing.itemId._id;
      const unitId = ing.unitId
        ? typeof ing.unitId === "string"
          ? ing.unitId
          : ing.unitId._id
        : null;

      const item = ingredients.find((i) => i._id === itemId);

      return {
        id: crypto.randomUUID(),
        itemId,
        itemName:
          item?.name ||
          (typeof ing.itemId === "object" ? ing.itemId.name : "Unknown"),
        unitId,
        unitName: unitId
          ? units.find((u: Unit) => u._id === unitId)?.name || null
          : null,
        quantity: ing.quantity,
        allowedUnits: item?.allowedUnitIds || [],
      };
    });
  };

  const getInitialInstructions = (): Instruction[] => {
    if (!recipe?.instructions || recipe.instructions.length === 0) {
      return [{ id: crypto.randomUUID(), text: "" }];
    }
    return recipe.instructions.map((text) => ({
      id: crypto.randomUUID(),
      text,
    }));
  };

  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientItem[]
  >([]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: crypto.randomUUID(), text: "" },
  ]);
  const [notesText, setNotesText] = useState("");

  const form = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: recipe?.name || "",
      timeInMinutes: recipe?.timeInMinutes || 30,
      serves: recipe?.serves || 4,
      categoryIds: recipe?.categoryIds
        ? recipe.categoryIds.map((cat) =>
            typeof cat === "string" ? cat : cat._id
          )
        : [],
      ingredients: [],
      instructions: recipe?.instructions || [],
      notes: recipe?.notes || [],
    },
  });

  // Initialize state when editing and reference data is loaded; sync form.ingredients so Zod has the data
  useEffect(() => {
    if (!recipe || ingredients.length === 0 || units.length === 0) return;
    const initial = getInitialIngredients();
    setSelectedIngredients(initial);
    setInstructions(getInitialInstructions());
    setNotesText(transformNotesForTextarea(recipe.notes));
    form.setValue(
      "ingredients",
      initial.map((ing) => ({
        itemId: ing.itemId,
        unitId: ing.unitId,
        quantity: ing.quantity,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, ingredients.length, units.length]);

  // Client-side auth and permission checks
  useEffect(() => {
    if (fetchingUser) return;

    if (!user) {
      router.push("/");
      return;
    }

    const userRole = user.role as unknown as UserRole;

    // Check if user has permission to create/edit recipes
    if (!hasPermission(userRole, Permission.CREATE_RECIPES)) {
      router.push("/your-crockpot");
      return;
    }

    // For editing: check ownership
    if (isEditing && recipe) {
      const recipeOwnerId =
        typeof recipe.createdById === "string"
          ? recipe.createdById
          : recipe.createdById;
      const isOwner = user._id === recipeOwnerId;
      const isAdmin = userRole === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        router.push("/your-crockpot");
        return;
      }
    }

    // For creating: check recipe limits
    if (!isEditing && recipeCount !== undefined) {
      const hasReachedLimit =
        (userRole === UserRole.FREE && recipeCount >= 5) ||
        (userRole === UserRole.PREMIUM && recipeCount >= 10);

      if (hasReachedLimit) {
        router.push("/your-crockpot");
        return;
      }
    }
  }, [router, user, fetchingUser, isEditing, recipe, recipeCount]);

  // Sync instructions with form state and clear validation errors
  useEffect(() => {
    const validInstructions = instructions
      .map((inst) => inst.text.trim())
      .filter((text) => text.length > 0);

    form.setValue("instructions", validInstructions);

    // Clear validation error if we have valid instructions
    if (validInstructions.length > 0) {
      form.clearErrors("instructions");
    }
  }, [instructions, form]);

  // Clear ingredients validation error when ingredients are added
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      form.clearErrors("ingredients");
    }
  }, [selectedIngredients, form]);

  // Handle form submission
  const onSubmit = async (data: CreateRecipeInput) => {
    try {
      // Handle image upload if needed
      let imageData: { url: string; filename: string } | null | undefined =
        recipe?.image || null;

      // Upload new image if user selected one
      if (hasImageChanged) {
        if (imageFile) {
          imageData = await uploadImage(imageFile);
        } else {
          // User removed the image
          imageData = null;
        }
      }

      // Only send unitIds that exist in the current units list (avoids 400 if a unit was deleted)
      const validUnitIds = new Set(units.map((u: Unit) => u._id));

      const recipeData = {
        name: data.name,
        timeInMinutes: data.timeInMinutes,
        serves: data.serves,
        categoryIds: data.categoryIds,
        ingredients: data.ingredients.map((ing) => ({
          itemId: ing.itemId,
          unitId:
            ing.unitId && validUnitIds.has(ing.unitId) ? ing.unitId : null,
          quantity: ing.quantity,
        })),
        instructions: data.instructions,
        notes: data.notes || [],
        image: imageData,
      };

      if (isEditing && recipe) {
        updateRecipeMutation.mutate({
          recipeId: recipe._id,
          data: recipeData,
        });
      } else {
        createRecipeMutation.mutate(recipeData);
      }
    } catch (error) {
      // Image upload error is handled by the hook
      console.error("Failed to submit recipe:", error);
    }
  };

  // Show skeleton while loading
  const isLoading =
    fetchingUser ||
    categoriesLoading ||
    itemsLoading ||
    unitsLoading ||
    (!isEditing && countLoading);

  if (isLoading) {
    return <CreateRecipeFormSkeleton />;
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="pb-0">
            <CardContent className="space-y-6 md:space-y-6">
              {/* Recipe Name */}
              <RecipeName control={form.control} />

              {/* Image Upload */}
              <ImageUpload
                imagePreview={imagePreview}
                onImageChange={(file, preview) => {
                  setImageFile(file);
                  setImagePreview(preview);
                  setHasImageChanged(true);
                }}
              />

              {/* Time and Serves Controls */}
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeInMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        min={1}
                        step={5}
                        max={1440}
                        label="Cooking Time (minutes)*"
                        icon={Clock}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serves"
                  render={({ field }) => (
                    <FormItem>
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        min={1}
                        max={50}
                        label="Serves*"
                        icon={Users}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Categories */}
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <Combobox
                      options={recipeCategories.map((cat: RecipeCategory) => ({
                        value: cat._id,
                        label: cat.name,
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Search categories..."
                      emptyIndicator="No categories found"
                      maxSelections={3}
                      label="Categories* (select 1-3)"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredients */}
              <FormField
                control={form.control}
                name="ingredients"
                render={() => (
                  <FormItem>
                    <IngredientManager
                      availableIngredients={ingredients}
                      units={units}
                      selectedIngredients={selectedIngredients}
                      onIngredientsChange={(newIngredients) => {
                        setSelectedIngredients(newIngredients);
                        // Update form with ingredient data
                        form.setValue(
                          "ingredients",
                          newIngredients.map((ing) => ({
                            itemId: ing.itemId,
                            unitId: ing.unitId,
                            quantity: ing.quantity,
                          }))
                        );
                      }}
                      className="space-y-3"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instructions */}
              <FormField
                control={form.control}
                name="instructions"
                render={() => (
                  <FormItem>
                    <Instructions
                      instructions={instructions}
                      setInstructions={setInstructions}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes Section */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes, tips, or variations for this recipe. Each new line is a new note..."
                        className="min-h-[100px]"
                        value={notesText}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          const newValue = e.target.value;
                          setNotesText(newValue);
                          const notes = transformTextareaToNotes(newValue);
                          field.onChange(notes);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            {/* Sticky Submit Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={
                    createRecipeMutation.isPending ||
                    updateRecipeMutation.isPending ||
                    isUploadingImage
                  }
                  className="w-full sm:w-auto min-w-[200px]"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createRecipeMutation.isPending ||
                    updateRecipeMutation.isPending ||
                    isUploadingImage
                  }
                  className="w-full sm:w-auto min-w-[200px]"
                  size="lg"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Image...
                    </>
                  ) : createRecipeMutation.isPending ||
                    updateRecipeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating Recipe..." : "Creating Recipe..."}
                    </>
                  ) : (
                    `${isEditing ? "Update" : "Create"} Recipe`
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CreateRecipeForm;
