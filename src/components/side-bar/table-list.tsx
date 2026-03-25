import { useTables } from "@/store/schema/selector";
import { FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { useSelectedTable } from "@/store/ui/selector";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";
import { useFocusTable } from "@/hooks/use-focus-table";

export const TableList = () => {
  const tables = useTables();
  const dispatch = useDispatch();
  const { focusTable } = useFocusTable();
  const selectedTable = useSelectedTable();

  const onSelectTable = (tableId: string) => {
    dispatch(selectTable(tableId));
  };

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel className="font-bold">Tables</FieldLabel>

      {tables.map((table) => (
        <Button
          key={table.id}
          className="w-full border-l-4 tuncate line-clamp-1 text-start"
          variant={selectedTable?.id === table.id ? "default" : "ghost"}
          size="lg"
          onClick={() => onSelectTable(table.id)}
          onDoubleClick={() => focusTable(table.id)}
        >
          {table.name}
        </Button>
      ))}
    </div>
  );
};
