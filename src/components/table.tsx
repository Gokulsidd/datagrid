/*
📄 Advanced Jira-Style Data Table
Features:
- Column resizing
- Column reordering (drag & drop)
- Sort, hide, and filter options in column menu
- Lazy loading on scroll
- Clean UI using ShadCN + TailwindCSS
*/

"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnOrderState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, MoreHorizontalIcon, ArrowUpIcon, ArrowDownIcon, XIcon, EyeOffIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fuzzyFilter } from "@/lib/utils";

// 🧪 Simulated lazy loading data
const generateMockData = (start: number, count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: start + i,
    key: `LEARNJIRA-${start + i}`,
    status: "TO DO",
    summary: `Permissions setup for item ${start + i}`,
    assignee: "gokulsidharth02",
    created: "Jun 12, 2025",
  }));
};

const defaultColumns: ColumnDef<any>[] = [
  {
    accessorKey: "key",
    header: "Key",
    cell: (info) => info.getValue(),
    meta: { filterable: true },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded bg-gray-200 text-xs font-medium text-gray-800">
        {row.original.status}
      </span>
    ),
    meta: { filterable: true },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: (info) => info.getValue(),
    meta: { filterable: true },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: (info) => info.getValue(),
  },
];

export function AdvancedJiraStyleTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(() => generateMockData(1, 30));
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    defaultColumns.map((col) => col.id!)
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

//   const filteredData = useMemo(() => {
//     return data.filter((row) => {
//       return Object.entries(columnFilters).every(([key, val]) =>
//         String(row[key] || "").toLowerCase().includes(val.toLowerCase())
//       );
//     });
//   }, [data, columnFilters]);

  const table = useReactTable({
    data: data,
    columns: defaultColumns,
    state: {
      columnOrder,
      columnVisibility,
    },
    filterFns: {
            fuzzy: fuzzyFilter
        },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      const next = generateMockData(data.length + 1, 20);
      setData((prev) => [...prev, ...next]);
    }
  }, [data]);

  function onDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
            });
        }
    }

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <div ref={containerRef} className="overflow-auto min-h-[620px] max-h-[640px] h-[620px] border rounded-md">
        <Table className="min-w-full table-fixed">
          <TableHeader>
            <SortableContext items={table.getAllLeafColumns().map((col) => col.id)} strategy={verticalListSortingStrategy}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DraggableColumnHeader
                      key={header.id}
                      header={header}
                      filter={columnFilters[header.column.id] || ""}
                      onFilterChange={(val) =>
                        setColumnFilters((prev) => ({ ...prev, [header.column.id]: val }))
                      }
                    />
                  ))}
                </TableRow>
              ))}
            </SortableContext>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DndContext>
  );
}

function DraggableColumnHeader({ header, filter, onFilterChange }: { header: any; filter: string; onFilterChange: (val: string) => void }) {
  const { column } = header;
  const { setNodeRef, attributes, listeners, transform, isDragging } = useSortable({ id: column.id });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    width: column.getSize(),
  };

  const isFilterable = column.columnDef.meta?.filterable;

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      className="bg-gray-50 p-0 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
    >
      <div className="flex items-center justify-between px-3 py-3 h-full gap-2">
        <div className="flex items-center gap-1">
          <GripVerticalIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab" {...attributes} {...listeners} />
          {flexRender(column.columnDef.header, header.getContext())}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1 space-y-1 bg-white shadow-lg rounded-md border border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUpIcon className="w-4 h-4 mr-2" /> Sort ascending
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDownIcon className="w-4 h-4 mr-2" /> Sort descending
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
              disabled={!column.getIsSorted()}
              onClick={() => column.clearSorting()}
            >
              <XIcon className="w-4 h-4 mr-2" /> Clear sorting
            </Button>
            {isFilterable && (
              <Input
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Filter..."
                className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOffIcon className="w-4 h-4 mr-2" /> Hide column
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  );
}
