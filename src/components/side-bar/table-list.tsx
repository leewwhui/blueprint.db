import { useTables } from "@/store/schema/selector";
import { FieldLabel } from "../ui/field";
import { TableItem } from "./table-item";

export const TableList = () => {
  const tables = useTables();

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel className="font-bold">Tables</FieldLabel>

      {tables.map((table) => (
        <TableItem table={table} key={table.id} />
      ))}
    </div>
  );
};
