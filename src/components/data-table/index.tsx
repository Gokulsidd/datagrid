import useMockData from "@/hooks/useMockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ColumnHeaderMenu from "./columnHeaderMenu";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  Cell, // Import Cell
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Header, // Import Header
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

import { useHeaderStore } from "@/store/useHeaderStore";

// This component makes the table header draggable.
function DraggableTableHead<T>({
  header,
}: {
  header: Header<T, unknown>;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  // Apply styles for dragging effect and transformations.
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.95 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",                                              
    zIndex: isDragging ? 10 : 0, 
    boxShadow: isDragging ? '0px 10px 20px rgba(0, 0, 0, 0.1)' : 'none', 
    backgroundColor: isDragging ? '#035afc' : '',
    width: header.getSize(),
    color: isDragging ? 'white' : 'black',
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center  ${isDragging? 'border-b border-blue-500 rounded-t-sm shadow-lg' : ''}  group bg-zinc-100/80 px-2 py-3 border-b border-gray-200 shadow-xs`}
    >
      <div className="flex items-center justify-between w-full overflow-hidden">
        <div className={`flex items-center gap-0 ${isDragging? 'white' : 'text-gray-700'}  font-medium`}>
          {/* The grip handle for dragging */}
          <button
            {...attributes}
            {...listeners}
            className={`cursor-grab active:cursor-grabbing ${isDragging? 'white' : 'text-gray-700 hover:text-gray-800'} `}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          {/* Render the header content */}
          {header.isPlaceholder
            ? null
            : header.column.columnDef.header instanceof Function
            ? header.column.columnDef.header(header.getContext())
            : header.column.columnDef.header}
        </div>
      </div>
      {/* Resizer handle */}
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        onDoubleClick={() => header.column.resetSize()}
        className={`absolute right-0 top-0 h-full w-1.5 bg-transparent hover:bg-gray-200 cursor-col-resize`}
        style={{
          touchAction: "none",
          userSelect: "none",
          zIndex: 10,
        }}
      />
      {/* Column menu that appears on hover */}
      {!isDragging && (
        <div className="absolute right-0 top-5 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ColumnHeaderMenu
          column={header.column}
          sortDirection={header.column.getIsSorted()}
          onSortChange={(dir) =>
            dir
              ? header.column.toggleSorting(dir === "desc")
              : header.column.clearSorting()
          }
        />
      </div>
      )}
    </TableHead>
  );
}

// This new component makes the table cells draggable along with the header.
function DraggableTableCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  // Apply styles for dragging effect and transformations.
  // This ensures the cell moves with the header.
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.95 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out", 
    width: cell.column.getSize(),
    zIndex: isDragging ? 10 : 0,
    // boxShadow: isDragging ? '0px 10px 20px rgba(0, 0, 0, 0.1)' : 'none', 
    backgroundColor: isDragging ? 'white' : '',
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      className={`truncate px-3 py-2 text-sm text-gray-700 ${isDragging ? 'border-x border-blue-500' : null}`}
    >
      {cell.column.columnDef.cell instanceof Function
        ? cell.column.columnDef.cell(cell.getContext())
        : cell.column.columnDef.cell}
    </TableCell>
  );
}


interface DataTableProps {
  searchQuery: string;
}

const DataTable = ({ searchQuery }: DataTableProps) => {
  const [page, setPage] = useState(0);
  const { tableData, error} = useMockData();
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const { isHeaderVisible } = useHeaderStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableHeight, setTableHeight] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const rawData =
      tableData?.results?.[0]?.hits?.map((item: any) => item.document) || [];

    if (!searchQuery) {
      return rawData;
    }

    return rawData.filter((row: any) =>
      Object.values(row).some((value: any) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tableData, searchQuery]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols =
      tableData?.columns?.map((col: any) => ({
        header: (headerContext: any) => {
          const columnSize = headerContext.header.column.getSize();
          return (
            <div className="flex items-center justify-between group px-1 py-1 relative">
              <Tooltip>
                <TooltipTrigger>
                  <p
                    className={`truncate transition-all duration-200  font-medium ${
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
        enableSorting: true,
        id: col.FieldName,
        size: 200,
        minSize: 100,
        maxSize: 800,
        meta: {
          FieldType: col.FieldType,
          FieldName: col.FieldName,
        },
        cell: (ctx: CellContext<any, any>) => {
          const value = ctx.getValue();
          return value !== "" && value !== undefined && value !== null
            ? value
            : "-";
        },
      })) || [];

    // Initialize column order from columns if not already set.
    if (cols.length > 0 && columnOrder.length === 0) {
      setColumnOrder(cols.map((c: any) => c.id as string));
    }

    return cols;
  }, [tableData]); // Removed columnOrder from dependency array to prevent re-renders

  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = isHeaderVisible ? 112 : 56;
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
      sorting,
    },
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // This function handles the end of a drag event.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((currentOrder) => {
        const oldIndex = currentOrder.indexOf(active.id as string);
        const newIndex = currentOrder.indexOf(over.id as string);
        // arrayMove is a utility from @dnd-kit to reorder the array.
        return arrayMove(currentOrder, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="p-0" style={{ height: tableHeight, overflow: "auto" }} ref={scrollContainerRef}>
      {/* DndContext provides the drag and drop functionality */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <Table style={{ width: table.getTotalSize() || "100%" }}>
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex">
                {/* SortableContext provides the context for draggable items */}
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHead
                      key={header.id}
                      header={header}
                    />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="flex">
                {/* 
                  This is the key change. We wrap the cells of each row in a SortableContext.
                  This makes the cells aware of the column order and allows them to be reordered
                  horizontally along with the headers.
                */}
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {row.getVisibleCells().map((cell) => (
                    <DraggableTableCell key={cell.id} cell={cell} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
};

export default DataTable;

