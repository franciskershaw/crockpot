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
  file: File | Buffer,
  folder: string = "Crockpot"
) => {
  try {
    let fileData: string | Buffer;

    // Handle File object by converting to buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
    } else {
      fileData = file;
    }

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${fileData.toString("base64")}`,
      {
        folder: folder,
        resource_type: "auto",
        // Automatic format optimization (WebP, AVIF when supported)
        format: "auto",
        quality: "auto:good",
        fetch_format: "auto",
        // File size limits at Cloudinary level (5MB backup)
        bytes: 5000000,
        // Enable automatic optimization features
        flags: "progressive",
        // Generate responsive breakpoints for different screen sizes
        responsive_breakpoints: [
          {
            create_derived: true,
            bytes_step: 20000,
            min_width: 200,
            max_width: 1000,
            transformation: {
              quality: "auto:good",
              fetch_format: "auto",
            },
          },
        ],
      }
    );

    return {
      url: result.secure_url,
      filename: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};
