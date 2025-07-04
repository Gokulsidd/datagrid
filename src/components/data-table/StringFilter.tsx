import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface StringFilterProps {
  column: any;
  onApplyFilter: (columnId: string, type: string, value: string) => void;
}

export function StringFilter({ column, onApplyFilter }: StringFilterProps) {
  const [filterType, setFilterType] = useState("is");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);


  const columnId = column?.columnDef?.id;

  const filterOptions = [
    { label: "Is", value: "is" },
    { label: "Is not", value: "isNot" },
    { label: "Contains", value: "contains" },
    { label: "Does not contain", value: "notContains" },
    { label: "Starts with", value: "startsWith" },
    { label: "Ends with", value: "endsWith" },
    { label: "Is empty", value: "isEmpty" },
    { label: "Is not empty", value: "isNotEmpty" },
  ];

  const handleApply = () => {
    onApplyFilter(columnId, filterType, inputValue);
  };

  const showInput = !["isEmpty", "isNotEmpty"].includes(filterType);

  return (
    <div className="p-2 space-y-3 w-full">
      {/* Filter Type Dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal text-gray-800">
            {filterOptions.find((f) => f.value === filterType)?.label ?? "Filter Type"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-50 max-h-50 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="w-full justify-start font-normal text-gray-800 hover:bg-gray-100 rounded-md"
              onClick={() => {
                setFilterType(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Input Field */}
      {showInput && (
        <Input
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}

      {/* Apply Button */}
      <Button
        className="w-full"
        onClick={handleApply}
        disabled={showInput && inputValue.trim() === ""}
      >
        Apply Filter
      </Button>
    </div>
  );
}
