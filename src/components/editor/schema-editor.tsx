import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Connection,
  type Edge,
} from "@xyflow/react";
import { TableNode } from "../nodes/table-node";
import { useDispatch } from "react-redux";
import { NoTable } from "../no-table";
import type { TableNodeData } from "@/contracts/schema";
import { nanoid } from "nanoid";
import { useTableNodes } from "@/hooks/use-table-nodes";
import { useTableRelations } from "@/hooks/use-table-relations";
import { useTablePosition } from "@/store/ui/selector";
import { MoveTableCommand } from "@/commands/MoveTableCommand";
import { useHistory } from "@/hooks/use-history";
import { CreateRelationCommand } from "@/commands/CreateRelationCommand";
import toast from "react-hot-toast";
import { FKEdge } from "../nodes/fk-edge";
import { selectRelation, selectTable } from "@/store/ui/slice";
import { useRelationValidate } from "@/hooks/use-relation-validation";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";

export const SchemaEditor = () => {
  const { nodes, onNodesChange } = useTableNodes();
  const { edges, onEdgesChange } = useTableRelations();
  const validateRelation = useRelationValidate();

  const dispatch = useDispatch();
  const positions = useTablePosition();
  const history = useHistory();

  const updateNodePosition = (node: Node<TableNodeData>) => {
    const previousPosition = positions[node.id] || { x: 0, y: 0 };

    if (
      previousPosition.x === node.position.x &&
      previousPosition.y === node.position.y
    ) {
      return;
    }

    const moveTableCommand = new MoveTableCommand(
      [{ tableId: node.id, position: previousPosition }],
      [{ tableId: node.id, position: node.position }],
    );

    history.executeCommand(moveTableCommand);
  };

  const onConnect = (connection: Connection) => {
    if (!connection.sourceHandle || !connection.targetHandle) return;

    const relation = {
      id: nanoid(),
      sourceTableId: connection.source,
      sourceColumnId: connection.sourceHandle,
      targetTableId: connection.target,
      targetColumnId: connection.targetHandle,
      cardinality: ForeignKeyCardinality.ONE_TO_ONE,
      onUpdate: ForeignKeyReferentialAction.NO_ACTION,
      onDelete: ForeignKeyReferentialAction.NO_ACTION,
    };

    const validation = validateRelation(
      relation.sourceTableId,
      relation.sourceColumnId,
      relation.targetTableId,
      relation.targetColumnId,
    );

    if (!validation.valid) {
      return toast.error(validation.message);
    }

    history.executeCommand(new CreateRelationCommand(relation));
  };

  const onNodeDoubleClick = (
    _: React.MouseEvent,
    node: Node<TableNodeData>,
  ) => {
    dispatch(selectTable(node.id));
  };

  const onEdgeDoubleClick = (_: React.MouseEvent, edge: Edge) => {
    dispatch(selectRelation(edge.id));
  };

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          tableNode: TableNode,
        }}
        edgeTypes={{
          fkEdge: FKEdge,
        }}
        onConnect={onConnect}
        onNodeDragStop={(_, node) => updateNodePosition(node)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable />}
    </div>
  );
};
