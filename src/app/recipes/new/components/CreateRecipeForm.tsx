"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { createRecipeSchema, type CreateRecipeInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Clock, Users } from "lucide-react";
import type { Item, RecipeCategory, Unit } from "@/data/types";
import ImageUpload from "./ImageUpload";
import RecipeName from "./RecipeName";
import { MultiSelect } from "@/components/ui/multi-select";
import IngredientManager, { type IngredientItem } from "./IngredientManager";

interface CreateRecipeFormProps {
  recipe?: Partial<CreateRecipeInput>;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientItem[]
  >([]);

  // TODO: Implement image file handling for form submission

  const form = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: "",
      timeInMinutes: 30,
      serves: 4,
      categoryIds: [],
      ingredients: [],
      instructions: [],
      notes: [],
      ...recipe,
    } as CreateRecipeInput,
  });

  return (
    <Form {...form}>
      <form>
        <Card>
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
              <NumberInput
                value={form.watch("timeInMinutes")}
                onChange={(value) => form.setValue("timeInMinutes", value)}
                min={1}
                step={5}
                max={1440}
                label="Cooking Time"
                icon={Clock}
              />
              <NumberInput
                value={form.watch("serves")}
                onChange={(value) => form.setValue("serves", value)}
                min={1}
                max={50}
                label="Serves"
                icon={Users}
              />
            </div>

            {/* Categories */}
            <MultiSelect
              options={recipeCategories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              onValueChange={(selected) =>
                form.setValue("categoryIds", selected)
              }
              defaultValue={form.watch("categoryIds")}
              placeholder="Search categories..."
              emptyIndicator="No categories found"
              maxSelections={3}
              hideSelectAll
              singleLine
              label="Categories* (select 1-3)"
            />

            {/* Ingredients */}
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CreateRecipeForm;
