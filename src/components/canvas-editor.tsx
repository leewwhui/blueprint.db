import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Connection,
} from "@xyflow/react";
import { TableNode } from "./nodes/table-node";
import { useDispatch } from "react-redux";
import { NoTable } from "./no-table";
import type { TableNodeData } from "@/contracts/schema";
import { addRelation } from "@/store/schema/slice";
import { nanoid } from "nanoid";
import { useTableNodes } from "@/hooks/use-table-nodes";
import { useTableRelations } from "@/hooks/use-table-relations";
import { useTablePosition } from "@/store/ui/selector";
import { toast } from "sonner";
import { useRelationValidate } from "@/hooks/use-relation-validate";
import { MoveTableCommand } from "@/commands/MoveTableCommand";
import { useHistory } from "@/hooks/use-history";

export const CanvasEditor = () => {
  const { nodes, onNodesChange } = useTableNodes();
  const { edges, onEdgesChange } = useTableRelations();

  const validateRelation = useRelationValidate();

  const dispatch = useDispatch();
  const positions = useTablePosition();

  const history = useHistory();

  const updateNodesPosition = (nodes: Node<TableNodeData>[]) => {
    nodes.forEach((node) => {
      const position = { tableId: node.id, position: node.position };
      const oldPosition = { tableId: node.id, position: positions[node.id] };

      const moveTableCommand = new MoveTableCommand(
        node.id,
        oldPosition.position || { x: 0, y: 0 },
        position.position,
      );

      history.executeCommand(moveTableCommand);
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

    const validation = validateRelation(
      relation.sourceTableId,
      relation.sourceColumnId,
      relation.targetTableId,
      relation.targetColumnId,
    );

    if (!validation.valid) {
      return toast.error(validation.message, {
        position: "top-center",
      });
    }

    dispatch(addRelation(relation));
  };

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          tableNode: TableNode,
        }}
        onConnect={onConnect}
        onNodeDragStop={(_, __, nodes) => updateNodesPosition(nodes)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable></NoTable>}
    </div>
  );
};
