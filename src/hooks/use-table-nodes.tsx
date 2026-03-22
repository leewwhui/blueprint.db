import { useTables } from "@/store/schema/selector";
import { useTablePosition } from "@/store/ui/selector";
import type { Node } from "@xyflow/react";
import { useMemo } from "react";

export const useTableNodes = (): Node[] => {
  const tables = useTables();
  const tablePositions = useTablePosition();

  return useMemo(() => {
    return tables.map((table) => {
      const position = tablePositions[table.id];

      return {
        id: table.id,
        position: position || { x: 0, y: 0 },
        data: {
          id: table.id,
          name: table.name,
          columns: table.columns,
        },
        type: "tableNode",
      };
    });
  }, [tables, tablePositions]);
};
