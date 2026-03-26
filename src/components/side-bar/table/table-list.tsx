import { useTables } from "@/store/schema/selector";
import { TableItem } from "./table-item";

export const TableList = () => {
  const tables = useTables();

  return (
    <div className="flex flex-col gap-3">
      {tables.map((table) => (
        <TableItem table={table} key={table.id} />
      ))}
    </div>
  );
};
