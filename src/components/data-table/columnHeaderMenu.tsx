"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CircleArrowDown,
  FilterIcon,
  MoreVertical,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";
import { useState } from "react";
import { ColumnFilterPopover } from "./columnFilterPopover";

import { Column } from "@tanstack/react-table";

interface ColumnMenuProps {
  column: Column<any>;
  sortDirection: false | "asc" | "desc";
  onSortChange: (dir: "asc" | "desc" | null) => void;
  columnType?: "string" | "enum" | "date";
}

export default function ColumnHeaderMenu({
  column,
  sortDirection,
  onSortChange,
  columnType = "string",
}: ColumnMenuProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-600 hover:bg-gray-200 rounded-full">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="flex flex-col w-50 p-2 space-y-1 text-sm rounded-lg shadow-lg border border-gray-200 bg-white"
      >
        <Button
          variant="ghost"
          onClick={() => onSortChange("asc")}
          className="font-normal w-full flex justify-start items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <SortAscIcon className="w-4 h-4 text-gray-500" />
          Sort Ascending
        </Button>
        <Button
          variant="ghost"
          onClick={() => onSortChange("desc")}
          className="font-normal w-full flex justify-start items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <SortDescIcon className="w-4 h-4 text-gray-500" />
          Sort Descending
        </Button>
        <Button
          variant="ghost"
          onClick={() => onSortChange(null)}
          className="font-normal w-full flex justify-start items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <CircleArrowDown className="w-4 h-4 text-gray-500" />
          Clear Sorting
        </Button>
        <Button
          variant="ghost"
          className="font-normal w-full flex justify-start items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FilterIcon className="w-4 h-4 text-gray-500" />
          Filter Column
        </Button>
        {filterOpen && (
          <div className="p-2 border-t border-gray-200 mt-1">
            <ColumnFilterPopover />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
