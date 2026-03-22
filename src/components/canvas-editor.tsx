import {
  ReactFlow,
  Background,
  Controls,
  type Viewport,
  useNodesState,
  type Node,
} from "@xyflow/react";
import { TableNode } from "./nodes/table-node";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NoTable } from "./no-table";
import { useTables } from "@/store/schema/selector";
import { useTablePosition } from "@/store/ui/selector";
import type { TableNodeData } from "@/contracts/schema";
import { updateTablePosition } from "@/store/ui/slice";

export const CanvasEditor = () => {
  const tables = useTables();
  const tablePositions = useTablePosition();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableNodeData>>(
    [],
  );
  const dispatch = useDispatch();
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

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

  const updateNodesPosition = (nodes: Node<TableNodeData>[]) => {
    nodes.forEach((node) => {
      const position = { tableId: node.id, position: node.position };
      dispatch(updateTablePosition(position));
    });
  };

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        viewport={viewport}
        onViewportChange={setViewport}
        onNodesChange={onNodesChange}
        nodeTypes={{
          tableNode: TableNode,
        }}
        onNodeDragStop={(event, node, nodes) => updateNodesPosition(nodes)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable></NoTable>}
    </div>
  );
};
