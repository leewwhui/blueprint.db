import { useTables } from "@/store/schema/selector";
import { useSelectedTable, useTableColor } from "@/store/ui/selector";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";
import { Button } from "@/components/ui/button";
import { DefaultTableTheme } from "@/lib/colors";
import { useFocusTable } from "@/hooks/use-focus-table";

export const Sidebar = () => {
  const tables = useTables();
  const dispatch = useDispatch();
  const { focusTable } = useFocusTable();
  const selectedTable = useSelectedTable();
  const tableColors = useTableColor();

  const onSelectTable = (tableId: string) => {
    dispatch(selectTable(tableId));
  };

  return (
    <aside className="w-(--side-width) border-r shadow p-3 flex flex-col gap-1">
      {tables.map((table) => (
        <Button
          key={table.id}
          className="w-full border-l-4 rounded truncate line-clamp-1 text-start"
          style={{
            borderLeftColor: tableColors[table.id] || DefaultTableTheme,
          }}
          variant={selectedTable?.id === table.id ? "secondary" : "ghost"}
          size="lg"
          onClick={() => onSelectTable(table.id)}
          onDoubleClick={() => focusTable(table.id)}
        >
          {table.name}
        </Button>
      ))}
    </aside>
  );
};
