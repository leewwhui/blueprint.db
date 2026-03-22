import {
  ReactFlow,
  Background,
  Controls,
  type Viewport,
  type Node,
  type Connection,
} from "@xyflow/react";
import { TableNode } from "./nodes/table-node";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NoTable } from "./no-table";
import type { TableNodeData } from "@/contracts/schema";
import { updateTablePosition } from "@/store/ui/slice";
import { addRelation } from "@/store/schema/slice";
import { nanoid } from "nanoid";
import { useTableNodes } from "@/hooks/use-table-nodes";
import { useTableRelations } from "@/hooks/use-table-relations";

export const CanvasEditor = () => {
  const { nodes, onNodesChange } = useTableNodes();
  const { edges, onEdgesChange } = useTableRelations();

  const dispatch = useDispatch();
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  const updateNodesPosition = (nodes: Node<TableNodeData>[]) => {
    nodes.forEach((node) => {
      const position = { tableId: node.id, position: node.position };
      dispatch(updateTablePosition(position));
    });
  };

  const onConnect = (connection: Connection) => {
    if (!connection.sourceHandle || !connection.targetHandle) return;

    const relation = {
      id: nanoid(),
      sourceTableId: connection.source,
      sourceColumnId: connection.sourceHandle,
      targetTableId: connection.target,
      targetColumnId: connection.targetHandle,
    };

    dispatch(addRelation(relation));
  };

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        viewport={viewport}
        onViewportChange={setViewport}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          tableNode: TableNode,
        }}
        onConnect={onConnect}
        onNodeDragStop={(event, node, nodes) => updateNodesPosition(nodes)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable></NoTable>}
    </div>
  );
};
