import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ListFilterProps {
  column: any;
  tableData: any;
  onApplyFilter: (columnId: string, type: string, values: string[]) => void;
}

export function ListFilter({
  column,
  tableData,
  onApplyFilter,
}: ListFilterProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("is");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(tableData);

  const columnId = column?.columnDef.id;

  const facetValues = useMemo(() => {
    // const facet = tableData?.results
    //   ?.flatMap((result: any) => results?.facet_counts || [])
    //   ?.find(
    //     (f: any) =>
    //       f.field_name ===
    //         `system.lf.file.properties.${column.columnDef.meta.FieldName}_str` ||
    //       f.field_name === columnId
    //   );
    // return facet?.counts?.map((c: any) => c.value) || [];

    const facet = tableData?.results[1].facet_counts[0].counts.map(
      (count: any) => count.value
    );
    return facet;
  }, [tableData, columnId]);

  const filteredValues = useMemo(() => {
    return facetValues?.filter((v: string) =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facetValues, searchTerm]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedValues((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleApply = () => {
    onApplyFilter(columnId, filterType, selectedValues);
  };

  const filterTypes = [
    { label: "Is", value: "is" },
    { label: "Is not", value: "isNot" },
    { label: "Is empty", value: "isEmpty" },
    { label: "Is not empty", value: "isNotEmpty" },
  ];

  return (
    <div className="p-2 space-y-3 w-full">
      {/* Filter Type Selector */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal text-gray-800"
          >
            {filterTypes.find((t) => t.value === filterType)?.label ??
              "Filter type"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-50 max-h-50 overflow-x-auto">
          {filterTypes.map((type) => (
            <Button
              key={type.value}
              variant="ghost"
              className="w-full justify-start font-normal text-gray-800 hover:bg-gray-100 rounded-md"
              onClick={() => {
                setFilterType(type.value);
                setOpen(false);
              }}
            >
              {type.label}
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Optional Search Bar for Multi-select */}
      <>
        <Input
          placeholder="Search..."
          className="w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Value List */}
        <div className="max-h-48 overflow-y-auto overflow-x-auto border rounded-md px-2 py-1 bg-white">
          {filteredValues?.length > 0 ? (
            filteredValues.map((value: string) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 py-1 px-1 hover:bg-muted rounded w-full">
                    <Checkbox
                      id={value}
                      checked={selectedValues.includes(value)}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(value, checked)
                      }
                    />
                    <label
                      htmlFor={value}
                      className="text-sm font-medium text-gray-700 truncate max-w-[12rem]"
                    >
                      {value}
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{value}</TooltipContent>
              </Tooltip>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No options available
            </p>
          )}
        </div>
      </>

      <Button className="w-full" onClick={handleApply}>
        Apply Filter
      </Button>
    </div>
  );
}
