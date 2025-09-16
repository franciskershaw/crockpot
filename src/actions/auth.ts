"use server";

import { signIn } from "@/auth";
import { z } from "zod";

export async function signInWithGoogle() {
  await signIn("google");
}

const emailSchema = z.object({
  email: z.string().trim().email(),
});

export async function sendMagicLink(formData: FormData) {
  try {
    const parsed = emailSchema.safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      console.error("Validation failed:", parsed.error);
      return;
    }

    const { email } = parsed.data;

    // Use the correct provider ID - "resend" not "email"
    const result = await signIn("resend", {
      email,
      redirectTo: "/",
      redirect: false,
    });

    if (result?.error) {
      console.error("Sign in error:", result.error);
      return;
    }

    console.log("Magic link sent successfully");
  } catch (error) {
    console.error("Error in sendMagicLink:", error);
    throw error;
  }
}
