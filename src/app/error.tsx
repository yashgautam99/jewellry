"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          We apologize for the inconvenience. Our team has been notified and is
          looking into the issue.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Return Home
          </Button>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
