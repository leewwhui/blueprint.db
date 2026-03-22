import { useTables } from "@/store/schema/selector";
import { useSelectedTable } from "@/store/ui/selector";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const tables = useTables();
  const store = useStoreApi();
  const dispatch = useDispatch();
  const { setCenter } = useReactFlow();
  const selectedTable = useSelectedTable();

  useEffect(() => {
    if (selectedTable) {
      focusTable(selectedTable.id);
    }
  }, [selectedTable]);

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
    <aside className="w-(--side-width) border-r shadow p-3 flex flex-col">
      {tables.map((table) => (
        <Button
          key={table.id}
          className="w-full flex justify-start"
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
