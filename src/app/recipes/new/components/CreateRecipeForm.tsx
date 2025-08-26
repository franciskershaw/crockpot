"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createRecipeSchema, type CreateRecipeInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import RecipeName from "./RecipeName";

interface CreateRecipeFormProps {
  recipe?: Partial<CreateRecipeInput>;
}

const CreateRecipeForm = ({ recipe }: CreateRecipeFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CreateRecipeForm;
