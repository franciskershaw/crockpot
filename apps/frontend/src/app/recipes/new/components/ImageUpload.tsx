"use client";

import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
}

const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeImage = useCallback(() => {
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onImageChange]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          onImageChange(file, preview);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  return (
    <div className="space-y-2">
      <FormLabel>Recipe Photo</FormLabel>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {imagePreview ? (
          <div className="relative">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={imagePreview!}
                alt="Recipe preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              <Button type="button" variant="outline" onClick={removeImage}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Add a photo of your finished dish
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
