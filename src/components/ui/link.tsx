"use client";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import NextLink, { useLinkStatus } from "next/link";
import { useEffect, useState } from "react";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  loader?: React.ReactNode;
};

export const Link = ({
  loader = <Loader className="animate-spin" />,
  ...props
}: LinkProps) => {
  const [pending, setPending] = useState(false);
  return (
    <NextLink
      {...props}
      onNavigate={(e) => {
        if (pending) e.preventDefault();
      }}
      className={cn("flex items-center", props.className)}
    >
      {pending ? (
        <>
          {props.children}
          <div className="p-0.5" />
          {loader}
        </>
      ) : (
        props.children
      )}
      <Pending onChange={(flag) => setPending(flag)} />
    </NextLink>
  );
};

const Pending = ({ onChange }: { onChange: (flag: boolean) => void }) => {
  const { pending } = useLinkStatus();
  useEffect(() => {
    onChange(pending);
  }, [pending, onChange]);
  return null;
};
