"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hooks/user/useUser";

import GoogleIcon from "./GoogleIcon";

export default function Auth() {
  const router = useRouter();
  const { user } = useUser();
  console.log(user)

  useEffect(() => {
    if (user) {
      router.push("/recipes");
    }
  }, [user, router]);
  return (
    <Card
      className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm w-full max-w-md"
      data-auth-section
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Join Crockpot
        </CardTitle>
        <CardDescription className="text-gray-600">
          Start your cooking adventure today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          type="submit"
          variant="outline"
          className="w-full h-12 border-gray-300 hover:bg-gray-50"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
          }}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <div className="relative">
          <Separator />
        </div>
      </CardContent>
    </Card>
  );
}
