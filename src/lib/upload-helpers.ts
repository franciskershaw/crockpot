import { uploadImage } from "./cloudinary";
import { ValidationError } from "./errors";
import { getCldImageUrl } from "next-cloudinary";

/**
 * Supported image formats for recipe uploads
 */
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Maximum file size for recipe images (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Process and upload a recipe image with validation and optimization
 * Leverages next-cloudinary features for automatic optimization
 * @param imageFile - The image file to process
 * @returns Upload result with optimized URL and filename
 */
export async function processRecipeImage(
  imageFile?: File | null
): Promise<{ url: string; filename: string } | undefined> {
  if (!imageFile) return undefined;

  // Validate file type with specific supported formats
  if (!SUPPORTED_IMAGE_TYPES.includes(imageFile.type)) {
    throw new ValidationError(
      `Unsupported image format. Please use: ${SUPPORTED_IMAGE_TYPES.map(
        (type) => type.split("/")[1]
      ).join(", ")}`
    );
  }

  // Validate file size (client-side validation before Cloudinary)
  if (imageFile.size > MAX_FILE_SIZE) {
    throw new ValidationError("Image must be less than 5MB");
  }

  try {
    // Upload with automatic optimization and responsive breakpoints
    const result = await uploadImage(imageFile, "recipes");

    return {
      url: result.url,
      filename: result.filename,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new ValidationError("Failed to upload image. Please try again.");
  }
}

/**
 * Delete a recipe image from Cloudinary
 * @param filename - The public_id of the image to delete
 */
export async function deleteRecipeImage(filename: string): Promise<void> {
  try {
    const { cloudinary } = await import("./cloudinary");
    await cloudinary.uploader.destroy(filename);
  } catch (error) {
    console.error("Failed to delete image from cloudinary:", error);
    // Don't throw error here as it's not critical to recipe deletion
  }
}

/**
 * Generate an optimized image URL using next-cloudinary
 * This leverages next-cloudinary's getCldImageUrl for proper optimization
 * @param publicId - The Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  // Use next-cloudinary's getCldImageUrl for proper optimization
  return getCldImageUrl({
    src: publicId,
    width: width,
    height: height,
    crop: width && height ? "fill" : undefined,
    gravity: "auto",
    format: "auto",
    quality: "auto:good",
  });
}
