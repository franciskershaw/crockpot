"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMagicLink } from "@/actions/auth";
import { toast } from "sonner";

export default function EmailAuth() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      await sendMagicLink(formData);
      toast.success(
        "Magic link sent! Please check your email and click the link to sign in."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send magic link. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <Input
        name="email"
        type="email"
        placeholder="your@email.com"
        required
        disabled={isLoading}
      />
      <input type="hidden" name="redirectTo" value="/" />
      <Button type="submit" className="w-full h-12" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send magic link"}
      </Button>
    </form>
  );
}
