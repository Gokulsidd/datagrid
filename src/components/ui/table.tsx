"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/store/useHeaderStore";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const { isHeaderVisible } = useHeaderStore();
  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <div className="overflow-auto bg-white">
        <table
          className={cn(
            "w-full caption-bottom text-sm ",
            "border-collapse", // Essential for datagrid borders
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "[&_tr]:border-b [&_tr]:border-gray-200",
        "sticky top-0 z-10 bg-gray-50",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        "divide-y divide-gray-200", // Stronger dividers for datagrid
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-gray-200 transition-colors",
        "hover:bg-gray-50/80",
        "data-[state=selected]:bg-primary-50",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-gray-700",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        "border-r border-gray-200 last:border-r-0", // Vertical borders between headers
        "bg-gray-50",
        "sticky top-0",
        " font-semibold uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        "text-sm text-gray-800",
        "border-r border-gray-200 last:border-r-0", // Vertical cell borders
        "group-hover:bg-gray-50/50",
        className
      )}
      {...props}
    />
  );
}

// Enhanced container with datagrid styling
function TableContainer({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden ",
        " bg-white shadow-sm", // Stronger outer border
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};