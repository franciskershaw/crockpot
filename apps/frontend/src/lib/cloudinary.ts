import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload image to Cloudinary with automatic optimization
 * For server-side uploads, we still need to use the Cloudinary SDK
 * next-cloudinary is primarily for client-side components and URL generation
 */
export const uploadImage = async (
  file: Blob | Buffer,
  folder: string = "Crockpot"
) => {
  try {
    let buffer: Buffer;

    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    const result = await new Promise<import("cloudinary").UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            // Derive on-the-fly at render time instead of at upload time
            quality: "auto:good",
            fetch_format: "auto",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      }
    );

    return {
      url: result.secure_url,
      filename: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
    throw new Error("Failed to upload image to Cloudinary");
  }
};
