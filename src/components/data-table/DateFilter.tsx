import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DateFilterProps {
  column: any;
  onApplyFilter: (columnId: string, type: string, value: string) => void;
}

export function DateFilter({ column, onApplyFilter }: DateFilterProps) {
  const [filterType, setFilterType] = useState("last_day");
  const [open, setOpen] = useState(false);


  const columnId = column?.columnDef?.id;

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "Last 30 Days", value: "last_30_days" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Is Empty", value: "is_empty" },
    { label: "Is Not Empty", value: "is_not_empty" },
  ];

  const handleApply = () => {
    onApplyFilter(columnId, "date", filterType);
  };

  return (
    <div className="p-2 space-y-3 w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal text-gray-800">
            {dateOptions.find((d) => d.value === filterType)?.label ?? "Select date filter"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-50 max-h-50 overflow-x-auto">
          {dateOptions.map((option) => (
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

      <Button className="w-full" onClick={handleApply}>
        Apply Filter
      </Button>
    </div>
  );
}
