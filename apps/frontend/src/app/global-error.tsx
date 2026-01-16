"use client";

import { Button } from "@/components/ui/button";
import { ChefHat, RefreshCw, Home, AlertTriangle } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body className="bg-surface-warm min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-6 h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <ChefHat key={i} className="h-8 w-8 text-brand-primary" />
              ))}
            </div>
          </div>

          {/* Error Card */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <ChefHat className="h-20 w-20 text-brand-primary" />
                <div className="absolute -top-3 -right-3 bg-red-100 rounded-full p-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Kitchen Emergency!
              </h1>
              <p className="text-gray-600 text-lg">
                Something serious went wrong with our recipe system.
              </p>
              <p className="text-gray-500">
                Our chefs are working hard to get everything back to normal.
                Please try refreshing the page.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={reset}
                size="lg"
                className="flex items-center gap-2 w-full"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Refresh Kitchen</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 w-full"
              >
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </Button>
            </div>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === "development" && (
              <details className="pt-6 border-t border-gray-200 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 text-center">
                  Technical Details (Development)
                </summary>
                <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-mono text-red-800 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-red-700 mt-1 overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </details>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem continues, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
