import { Context } from "hono";

import { ForbiddenError } from "../../../core/utils/errors";
import { cloudinary } from "../config/cloudinary.config";

const generateSignature = async (c: Context) => {
  const user = c.get("user");

  if (!user) {
    throw new ForbiddenError("Authentication required");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "recipes";

  // Generate signature for upload
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return c.json(
    {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    },
    200
  );
};

export default generateSignature;
