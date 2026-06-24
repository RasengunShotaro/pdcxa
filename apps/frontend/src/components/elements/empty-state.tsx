import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      {icon ? (
        <div className="mb-4 flex justify-center text-slate-400">{icon}</div>
      ) : null}
      <p className="text-base text-slate-500">{message}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
