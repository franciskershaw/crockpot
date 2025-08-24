/**
 * Examples of how to use next-cloudinary components in your React components
 * These are CLIENT-SIDE components that should be used in your UI components
 */

// Example: Display an optimized image
/*
import { CldImage } from 'next-cloudinary';

function RecipeImage({ publicId, alt }: { publicId: string; alt: string }) {
  return (
    <CldImage
      width="400"
      height="300"
      src={publicId}
      alt={alt}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto:good"
    />
  );
}
*/

// Example: Upload button for recipe images
/*
import { CldUploadButton } from 'next-cloudinary';

function RecipeImageUploader({ onUpload }: { onUpload: (result: any) => void }) {
  return (
    <CldUploadButton
      uploadPreset="recipe_uploads" // You need to create this in Cloudinary
      onUpload={(result) => {
        if (result.event === 'success') {
          onUpload({
            url: result.info.secure_url,
            filename: result.info.public_id
          });
        }
      }}
      options={{
        maxFileSize: 5000000, // 5MB
        multiple: false,
        folder: 'recipes',
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
      }}
    >
      Upload Recipe Image
    </CldUploadButton>
  );
}
*/

// Example: Upload widget with more control
/*
import { CldUploadWidget } from 'next-cloudinary';

function RecipeImageUploadWidget({ onUpload }: { onUpload: (result: any) => void }) {
  return (
    <CldUploadWidget
      uploadPreset="recipe_uploads"
      onUpload={onUpload}
      options={{
        maxFileSize: 5000000,
        folder: 'recipes',
        cropping: true,
        croppingAspectRatio: 4/3,
        sources: ['local', 'camera'],
        showAdvancedOptions: false,
        theme: 'minimal'
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          Upload Recipe Image
        </button>
      )}
    </CldUploadWidget>
  );
}
*/

export {};
