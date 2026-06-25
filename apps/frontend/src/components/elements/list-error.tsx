"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { errorDisplay } from "@/lib/error-message";

interface ListErrorProps {
  error: unknown;
  onRetry?: () => void;
}

export function ListError({ error, onRetry }: ListErrorProps) {
  const { kind, message } = errorDisplay(error);
  const variant = kind === "retryable" ? "default" : "destructive";
  const canRetry = kind !== "auth" && onRetry !== undefined;

  return (
    <Alert variant={variant}>
      <TriangleAlert />
      <AlertDescription>
        <p>{message}</p>
        {canRetry ? (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RotateCw />
            再試行
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
