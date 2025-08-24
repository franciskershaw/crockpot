import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

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
        format: "webp",
        quality: "auto:good",
        fetch_format: "auto",
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
