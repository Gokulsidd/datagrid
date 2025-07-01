"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useMockData from "@/hooks/useMockData";
import ColumnFilterDropdown from "./columnFilterDropdown";

export function ColumnFilterPopover({
  // initialValues = [],
  // onApplyAction,
}: {
  // initialValues?: string[];
  // onApplyAction: (vals: string[]) => void;
}) {
  // const [search, setSearch] = useState("");
  // const [selected, setSelected] = useState<string[]>(initialValues);
  const { tableData } = useMockData()

   const handleDocumentSelect = (document: any) => {
    console.log('Selected document:', document);
    // Add your filter logic here
  };

  // const filtered = useMemo(
  //   () =>
  //     initialValues.filter((v) =>
  //       v.toLowerCase().includes(search.toLowerCase())
  //     ),
  //   [search, initialValues]
  // );

  // const toggleValue = (val: string) => {
  //   setSelected((prev) =>
  //     prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
  //   );
  // }; 

  

  return (
    <div className="space-y-3 p-2">
      <div className="w-full">
        <ColumnFilterDropdown 
          tableData={tableData} 
          column={{ FieldName: tableData?.columns, FieldType: "Date" }} 
/>
      </div>
      <div className="flex flex-col gap-2"> 
        <Input
        placeholder="Search..."
        className="rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
        // value={search}
        // onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
        {/* {filtered.map((val) => (
          <div
            key={val}
            className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 rounded-md"
          >
            <Checkbox
              id={val}
              checked={selected.includes(val)}
              onCheckedChange={() => toggleValue(val)}
            />
            <label htmlFor={val} className="text-sm font-medium">
              {val}
            </label>
          </div>
        ))} */}
      </div>

      <Button
        size="sm"
        // onClick={() => onApplyAction(selected)}
        // disabled={!selected.length}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Apply Filter
      </Button>
      </div>
    </div>
  );
}
