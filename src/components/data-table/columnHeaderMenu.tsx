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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  ...props
}: ColumnMenuProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
      <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7  hover:bg-transparent text-gray-400 hover:text-gray-500 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
      </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Menu
          </TooltipContent>
        </Tooltip>
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
          <div className="border-t border-gray-200 mt-1">
            <ColumnFilterPopover column={column} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
