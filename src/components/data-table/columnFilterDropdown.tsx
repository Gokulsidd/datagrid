import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FilterIcon } from "lucide-react"
import React, { useState } from "react"

function ColumnFilterDropdown({ tableData, column }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  // Check if the column type is Date
  const isDateColumn = column?.FieldType === "Date"

  // Date filter options
  const dateFilterOptions = [
    { label: "Last day", value: "lastDay" },
    { label: "Last week", value: "lastWeek" },
    { label: "Last month", value: "lastMonth" },
    { label: "Last quarter", value: "lastQuarter" },
    { label: "Last year", value: "lastYear" },
    { label: "Custom range...", value: "customRange" },
  ]

  // Regular filter options from facet counts
  const facetFields = tableData?.results[0]?.facet_counts || []

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors border border-neutral-300">
          <FilterIcon className="h-4 w-4 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-2 shadow-lg rounded-xl border border-gray-200 bg-white"
      >
        <div className="max-h-[300px] overflow-y-auto">
          {isDateColumn ? (
            // Date-specific filters
            dateFilterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-md ${
                  selectedFilter === option.value ? "bg-gray-100" : ""
                }`}
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedFilter(option.value)
                  console.log("Selected date filter:", option.value)
                  // Add your date filter logic here
                }}
              >
                <span className="truncate font-medium">{option.label}</span>
                {selectedFilter === option.value && (
                  <span className="h-4 w-4 text-blue-500">✓</span>
                )}
              </DropdownMenuItem>
            ))
          ) : facetFields.length === 0 ? (
            // No filters available
            <div className="py-4 text-center text-sm text-gray-500">
              No filter options available
            </div>
          ) : (
            // Regular filters from facet counts
            facetFields.map((facet: any) => (
              <DropdownMenuItem
                key={facet.field_name}
                className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-md ${
                  selectedFilter === facet.field_name ? "bg-gray-100" : ""
                }`}
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedFilter(facet.field_name)
                  console.log("Selected filter:", facet.field_name)
                  // Add your filter logic here
                }}
              >
                <span className="truncate font-medium">
                  {facet.field_name.replace(/^system\.lf\.file\.properties\./, "")}
                </span>
                {selectedFilter === facet.field_name && (
                  <span className="h-4 w-4 text-blue-500">✓</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {selectedFilter && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <div className="p-2 text-xs text-gray-500 flex justify-end">
              <button
                className="text-blue-600 hover:text-blue-800 font-semibold"
                onClick={() => {
                  setSelectedFilter(null)
                  console.log("Filter cleared")
                  // Add your clear filter logic here
                }}
              >
                Clear filter
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColumnFilterDropdown