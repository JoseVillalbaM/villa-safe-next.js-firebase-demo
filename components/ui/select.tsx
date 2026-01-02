"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Select = ({ children, ...props }: React.ComponentPropsWithoutRef<"select">) => (
  <select
    {...props}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      props.className
    )}
  >
    {children}
  </select>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const SelectItem = ({ children, ...props }: React.ComponentPropsWithoutRef<"option">) => (
  <option {...props}>{children}</option>
);

const SelectTrigger = ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
  <div {...props}>{children}</div>
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span className="text-muted-foreground">{placeholder}</span>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
