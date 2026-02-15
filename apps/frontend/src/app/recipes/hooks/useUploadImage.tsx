import { useState } from "react";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";

interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

interface UploadResult {
  url: string;
  filename: string;
}

const useUploadImage = () => {
  const api = useAxios();
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Step 1: Get signed upload parameters from backend
      const { data: signatureData } = await api.post<UploadSignature>(
        "/api/upload/sign",
        {},
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );

      // Step 2: Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signatureData.signature);
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("api_key", signatureData.apiKey);
      formData.append("folder", signatureData.folder);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(
          errorData.error?.message || "Failed to upload image to Cloudinary"
        );
      }

      const cloudinaryData = await cloudinaryResponse.json();

      return {
        url: cloudinaryData.secure_url,
        filename: cloudinaryData.public_id,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setUploadError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadError,
  };
};

export default useUploadImage;
