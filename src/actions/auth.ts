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
      throw new Error("Invalid email address");
    }

    const { email } = parsed.data;

    const result = await signIn("resend", {
      email,
      redirectTo: "/",
      redirect: false,
    });

    if (result?.error) {
      console.error("Sign in error:", result.error);
      throw new Error("Failed to send magic link");
    }
  } catch (error) {
    throw error;
  }
}
