"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useHeaderStore } from "@/store/useHeaderStore"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const { isHeaderVisible } = useHeaderStore()
  return (
    <div className={`relative w-full ${isHeaderVisible ? 'h-[580px]' : 'h-[645px]'}  overflow-auto rounded-lg border border-neutral-200 bg-white`}>
      <table className={cn("w-full text-sm text-left", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 bg-gray-50 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("divide-y divide-neutral-200", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("bg-gray-50 border-t font-medium", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "hover:bg-gray-50 transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th 
      className={cn(
        "h-12 px-4 whitespace-nowrap font-semibold text-neutral-600 align-middle border-r last:border-r-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle border-r last:border-r-0 text-sm text-neutral-800 whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
