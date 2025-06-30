import useMockData, { collection } from "@/hooks/useMockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ColumnHeaderMenu from "./columnHeaderMenu";
import { useEffect, useMemo, useState } from "react";
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { DragOverlay } from "@dnd-kit/core";
import { Header } from "@tanstack/react-table";

import { useHeaderStore } from "@/store/useHeaderStore";

function DraggableTableHead<T>({ header, table }: { header: Header<T, unknown>; table: any }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });
  const { tableData } = useMockData()

  const style: {} = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    zIndex: isDragging ? 1 : 0,
    width: header.getSize(),
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center group hover:bg-neutral-100 px-2  ${isDragging ? "shadow-lg" : ""}`} 
    >
      <div className="flex items-center justify-between w-full overflow-hidden">
        <div className="flex items-center ">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing  text-neutral-400 hover:text-neutral-600"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {header.isPlaceholder
            ? null
            : header.column.columnDef.header instanceof Function
            ? header.column.columnDef.header(header.getContext())
            : header.column.columnDef.header}
        </div>
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onDoubleClick={() => header.column.resetSize()}
        className={`
          absolute right-[1.5px] top-0 h-full group-hover:w-2 hover:bg-neutral-200 cursor-col-resize
          ${
          header.column.getIsResizing() 
              ? 'border-neutral-200 bg-neutral-200'
              : 'border-transparent hover:border-neutral-200'
          }
          group-hover:w-2 group-hover:bg-neutral-200
          active:w-2 active:bg-neutral-200 active:border-neutral-200
        `}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          marginRight: '-2px',
          zIndex: 10,
        }}
      />
      <div className="invisible group-hover:visible transition-opacity duration-200 absolute right-2 top-1">
              <ColumnHeaderMenu sortDirection={"asc"} onSortChange={() => {}} />
            </div>
    </TableHead>
  );
}

const DataTable = () => {
  const { tableData, error } = useMockData();
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [tableHeight, setTableHeight] = useState(0);
  const { isHeaderVisible } = useHeaderStore();

  const data = useMemo(() => {
    return (
      tableData?.results?.[0]?.hits?.map((item: any) => item.document) || []
    );
  }, [tableData]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols =
      tableData?.columns?.map((col: any) => ({
        header: (headerContext: any) => {
          const columnSize = headerContext.header.column.getSize();
          return (
            <div className="flex items-center justify-between  group px-1 py-1 relative">
              <Tooltip>
                <TooltipTrigger>
                  <p
                    className={`truncate transition-all duration-200 ${
                      columnSize <= 100
                        ? "w-8"
                        : columnSize <= 150
                        ? "w-15"
                        : columnSize <= 200
                        ? "w-30"
                        : "w-60"
                    }`}
                  >
                    {col.FieldName}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{col.FieldName}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
        accessorKey: col.FieldName,
        id: col.FieldName,
        size: 200,
        minSize: 100,
        maxSize: 800,
        cell: (ctx: CellContext<any, any>) => {
          const value = ctx.getValue();
          return value !== "" && value !== undefined && value !== null
            ? value
            : "-";
        },
      })) || [];

    // Initialize column order
    if (cols.length > 0 && columnOrder.length === 0) {
      setColumnOrder(cols.map((col: any) => col.id as string));
    }

    return cols;
  }, [tableData, columnOrder]);

  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = isHeaderVisible ? 112 : 50; // Assuming header height is 64px
      const availableHeight = window.innerHeight - headerHeight;
      setTableHeight(availableHeight);
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [isHeaderVisible]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 10,
      maxSize: 1000,
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);

        if (oldIndex === -1 || newIndex === -1) return columnOrder;

        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
    setDraggedColumn(null);
  }

  return (
    <div className="p-0" style={{ height: tableHeight, overflow: 'auto' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          setDraggedColumn(event.active.id as string);
        }}
      >
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}  className="flex">
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHead
                      key={header.id}
                      header={header}
                      table={table}
                    />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id} className={`flex hover:bg-gray-100 transition-colors duration-200`}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id} 
                    style={{ 
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    }}
                    className="truncate p-4 border-b border-gray-200"
                  >
                    {cell.column.columnDef.cell instanceof Function
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.column.columnDef.cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DragOverlay>
          {draggedColumn &&
            (() => {
              const draggedColumnDef =
                table.getColumn(draggedColumn)?.columnDef;
              const headerContext = table
                .getHeaderGroups()[0]
                .headers.find((h) => h.id === draggedColumn)
                ?.getContext();
              const headerContent =
                draggedColumnDef?.header && headerContext
                  ? typeof draggedColumnDef.header === "function"
                    ? draggedColumnDef.header(headerContext)
                    : draggedColumnDef.header
                  : null;

              return (
                <Table
                  className="bg-white overflow-hidden border-1  border-blue-500"
                  style={{ width: table.getColumn(draggedColumn)?.getSize(), overflow: "hidden", borderRadius: "0px" }}
                >
                  <TableHeader className="rounded-lg border-1 border-blue-500  ">
                    <TableRow className="rounded-lg">
                      <TableHead className="px-4 bg-blue-500 text-white">
                        {headerContent}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-4 border-b">
                          {row.getValue(draggedColumn)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DataTable;
