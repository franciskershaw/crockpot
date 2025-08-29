"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { createRecipeSchema, type CreateRecipeInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Clock, Users, Loader2 } from "lucide-react";
import type { Item, RecipeCategory, Unit } from "@/data/types";
import { useCreateRecipe } from "@/hooks/useCreateRecipe";
import ImageUpload from "./ImageUpload";
import RecipeName from "./RecipeName";
import { Combobox } from "@/components/ui/combobox";
import IngredientManager, { type IngredientItem } from "./IngredientManager";
import Instructions, { type Instruction } from "./Instructions";
import {
  transformIngredientsForForm,
  transformInstructionsForForm,
  transformNotesForTextarea,
  transformTextareaToNotes,
  type EditRecipeInput,
} from "../helpers/recipe-form-helpers";

interface CreateRecipeFormProps {
  recipe?: Partial<CreateRecipeInput> | EditRecipeInput;
  recipeCategories: RecipeCategory[];
  ingredients: Item[];
  units: Unit[];
}

const CreateRecipeForm = ({
  recipe,
  recipeCategories,
  ingredients,
  units,
}: CreateRecipeFormProps) => {
  const createRecipeMutation = useCreateRecipe();
  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe?.image?.url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialize state using helper functions for better readability
  const initialIngredients = recipe?.ingredients
    ? transformIngredientsForForm(recipe.ingredients, ingredients, units)
    : [];

  const initialInstructions = recipe?.instructions
    ? transformInstructionsForForm(recipe.instructions)
    : transformInstructionsForForm([]);

  const [selectedIngredients, setSelectedIngredients] =
    useState<IngredientItem[]>(initialIngredients);
  const [instructions, setInstructions] =
    useState<Instruction[]>(initialInstructions);
  const [notesText, setNotesText] = useState(
    transformNotesForTextarea(recipe?.notes)
  );

  const form = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: recipe?.name || "",
      timeInMinutes: recipe?.timeInMinutes || 30,
      serves: recipe?.serves || 4,
      categoryIds: recipe?.categoryIds || [],
      ingredients: initialIngredients.map((ing) => ({
        itemId: ing.itemId,
        unitId: ing.unitId,
        quantity: ing.quantity,
      })),
      instructions: recipe?.instructions || [],
      notes: recipe?.notes || [],
      ...recipe,
    } as CreateRecipeInput,
  });

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
    // Create FormData for server action
    const formData = new FormData();

    // Add all form fields
    formData.append("name", data.name);
    formData.append("timeInMinutes", data.timeInMinutes.toString());
    formData.append("serves", data.serves.toString());
    formData.append("categoryIds", JSON.stringify(data.categoryIds));
    formData.append("ingredients", JSON.stringify(data.ingredients));
    formData.append("instructions", JSON.stringify(data.instructions));
    formData.append("notes", JSON.stringify(data.notes || []));

    // Add image file if present
    if (imageFile) {
      formData.append("image", imageFile);
    }

    createRecipeMutation.mutate(formData);
  };

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
                      options={recipeCategories.map((cat) => ({
                        value: cat.id,
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
              <Button
                type="submit"
                disabled={createRecipeMutation.isPending}
                className="w-full sm:w-auto min-w-[200px]"
                size="lg"
              >
                {createRecipeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {`${
                      recipe && "id" in recipe && recipe.id
                        ? "Updating Recipe..."
                        : "Creating Recipe..."
                    }`}
                  </>
                ) : (
                  `${
                    recipe && "id" in recipe && recipe.id ? "Update" : "Create"
                  } Recipe`
                )}
              </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CreateRecipeForm;
