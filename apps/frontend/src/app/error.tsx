"use client";

import { Button } from "@/components/ui/button";
import EmptyStateWithBackground from "@/components/ui/empty-state";
import { ChefHat, RefreshCw, Home, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Different error messages based on error type
  const getErrorMessage = () => {
    if (error.message.includes("404")) {
      return {
        title: "Recipe Not Found",
        description: "The recipe you're looking for doesn't exist.",
        suggestion: "Try browsing our recipe collection instead.",
      };
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      return {
        title: "Connection Problem",
        description: "We're having trouble connecting to our servers.",
        suggestion: "Please check your internet connection and try again.",
      };
    }

    if (error.message.includes("auth")) {
      return {
        title: "Authentication Error",
        description: "There was a problem with your session.",
        suggestion: "Please try logging in again.",
      };
    }

    return {
      title: "Something Went Wrong",
      description: "An unexpected error occurred while preparing your page.",
      suggestion: "Don't worry, our chefs are working to fix this!",
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <EmptyStateWithBackground>
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <ChefHat className="h-16 w-16 text-brand-primary" />
            <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 text-lg">{errorInfo.description}</p>
          <p className="text-gray-500 text-sm">{errorInfo.suggestion}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <details className="pt-4 border-t border-gray-200 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
              <p className="text-xs font-mono text-gray-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}

        {/* Additional Help */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </EmptyStateWithBackground>
  );
}
