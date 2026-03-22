import type { TableNodeData } from "@/contracts/schema";
import { useTables } from "@/store/schema/selector";
import { useTablePosition } from "@/store/ui/selector";
import { useNodesState, type Node } from "@xyflow/react";
import { useEffect } from "react";

export const useTableNodes = () => {
  const tables = useTables();
  const tablePositions = useTablePosition();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableNodeData>>(
    [],
  );

  useEffect(() => {
    const aggregatedNodes = tables.map((table) => {
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

    setNodes(aggregatedNodes);
  }, [tables, tablePositions]);

  return { nodes, setNodes, onNodesChange };
};
