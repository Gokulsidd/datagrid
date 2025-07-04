"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import useMockData from "@/hooks/useMockData";

import { StringFilter } from "./StringFilter";
import { DateFilter } from "./DateFilter";
import { ListFilter } from "./ListFilter";

interface ColumnFilterPopoverProps {
  column: any;
}

export function ColumnFilterPopover({ column }: ColumnFilterPopoverProps) {
  const { tableData } = useMockData();
  console.log(column)

  const fieldType = column?.columnDef?.meta?.FieldType;
  const fieldName = column?.columnDef?.meta?.FieldName;

  const handleApplyFilter = (
    columnId: string,
    filterType: string,
    value: any
  ) => {
    console.log(`Applying filter on ${columnId}`);
    console.log("Type:", filterType);
    console.log("Value:", value);

    // TODO: update your table filter state or fire an API request
  };

  const renderFilterComponent = () => {
    console.log(fieldType)
    switch (fieldType) {
      case "String":
        return (
          <StringFilter
            column={column}
            onApplyFilter={handleApplyFilter}
          />
        );
      case "Date":
        return (
          <DateFilter
            column={column}
            onApplyFilter={handleApplyFilter}
          />
        );
      case "List":
        return (
          <ListFilter
            column={column}
            tableData={tableData}
            onApplyFilter={handleApplyFilter}
          />
        );
      default:
        return (
          <div className="py-4 text-center text-sm text-gray-500">
            No filter available for this column type.
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderFilterComponent()}
    </div>
  );
}
