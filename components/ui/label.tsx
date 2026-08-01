"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-[11px] font-heading font-semibold uppercase tracking-wider text-void-400", className)}
    {...props}
  />
));
Label.displayName = "Label";

/** A labeled control row with an optional live value readout — used for every slider in the sidebar. */
export function FieldRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {value !== undefined && <span className="text-[11px] font-mono text-void-300">{value}</span>}
      </div>
      {children}
    </div>
  );
}

export { Label };
