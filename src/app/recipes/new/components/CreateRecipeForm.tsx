"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { createRecipeSchema, type CreateRecipeInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Clock, Users } from "lucide-react";
import ImageUpload from "./ImageUpload";
import RecipeName from "./RecipeName";

interface CreateRecipeFormProps {
  recipe?: Partial<CreateRecipeInput>;
}

const CreateRecipeForm = ({ recipe }: CreateRecipeFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
          <CardContent className="space-y-4 md:space-y-6">
            <RecipeName control={form.control} />

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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CreateRecipeForm;
