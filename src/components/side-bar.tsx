import { useTables } from "@/store/schema/selector";
import { useSelectedTable, useTableColor } from "@/store/ui/selector";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DefaultTableTheme } from "@/lib/colors";

export const Sidebar = () => {
  const tables = useTables();
  const store = useStoreApi();
  const dispatch = useDispatch();
  const { setCenter } = useReactFlow();
  const selectedTable = useSelectedTable();
  const tableColors = useTableColor();

  useEffect(() => {
    if (selectedTable?.id) {
      focusTable(selectedTable.id);
    }
  }, [selectedTable?.id]);

  const focusTable = (tableId: string) => {
    const { nodeLookup } = store.getState();

    const focusedNode = Array.from(nodeLookup).find(
      ([, node]) => node.data.id === tableId,
    );

    if (focusedNode) {
      const position = focusedNode[1].position;

      const x = position.x + (focusedNode[1].measured.width || 0) / 2;
      const y = position.y + (focusedNode[1].measured.height || 0) / 2;

      setCenter(x, y, { duration: 500, zoom: 1 });
    }
  };

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
