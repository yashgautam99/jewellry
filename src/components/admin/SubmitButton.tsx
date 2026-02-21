"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonProps {
  pendingText?: string;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for the Save/Submit button in admin forms.
 * Automatically shows a spinner and disables during form submission.
 */
export function SubmitButton({
  children,
  pendingText = "Saving...",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("relative", className)}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
