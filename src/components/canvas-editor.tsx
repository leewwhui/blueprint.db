import { useTableNodes } from "@/hooks/use-table-nodes";
import {
  ReactFlow,
  Background,
  Controls,
  type Viewport,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { TableNode } from "./nodes/table-node";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NoTable } from "./no-table";
import { updateTablePosition } from "@/store/ui/slice";

export const CanvasEditor = () => {
  const nodes = useTableNodes();
  const dispatch = useDispatch();
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  const onNodesChange = (changes: NodeChange<Node>[]) => {
    changes.forEach((change: NodeChange) => {
      if (change.type !== "position" || !change.position) return;

      const position = {
        tableId: change.id,
        position: change.position,
      };

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
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable></NoTable>}
    </div>
  );
};
