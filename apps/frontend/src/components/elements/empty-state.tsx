import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className="px-6 py-[72px] text-center">
      {icon ? (
        <div className="mb-4 flex justify-center text-ink-3">{icon}</div>
      ) : null}
      <p className="text-[0.9375rem] leading-[1.7] text-ink-3">{message}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
