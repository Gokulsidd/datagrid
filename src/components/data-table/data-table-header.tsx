import { Header, Table } from "@tanstack/react-table";
import { TableHead } from "../ui/table";

type DataTableHeaderProps<T> = {
  header: Header<T, unknown>;
  table: Table<T>;
};

const DataTableHeader = <T, >({ header, table }: DataTableHeaderProps<T>) => {
    return (
        <TableHead>Hello</TableHead>
    )
}