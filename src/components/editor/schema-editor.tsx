import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Connection,
} from "@xyflow/react";
import { TableNode } from "../nodes/table-node";
import { useDispatch } from "react-redux";
import { NoTable } from "../no-table";
import type { TableNodeData } from "@/contracts/schema";
import { addRelation } from "@/store/schema/slice";
import { nanoid } from "nanoid";
import { useTableNodes } from "@/hooks/use-table-nodes";
import { useTableRelations } from "@/hooks/use-table-relations";
import { useTablePosition } from "@/store/ui/selector";
import { MoveTableCommand } from "@/commands/MoveTableCommand";
import { useHistory } from "@/hooks/use-history";
import toast from "react-hot-toast";
import { FKEdge } from "../nodes/fk-edge";
import { selectTable } from "@/store/ui/slice";
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

  const updateNodesPosition = (nodes: Node<TableNodeData>[]) => {
    const toPositions = nodes.map((node) => ({
      tableId: node.id,
      position: node.position,
    }));

    const fromPositions = nodes.map((node) => ({
      tableId: node.id,
      position: positions[node.id] || { x: 0, y: 0 },
    }));

    const moveTableCommand = new MoveTableCommand(fromPositions, toPositions);

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

    dispatch(addRelation(relation));
  };

  const onNodeDoubleClick = (_: React.MouseEvent, node: Node<TableNodeData>) => {
    dispatch(selectTable(node.id));
  };

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        onNodeDoubleClick={onNodeDoubleClick}
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
        onNodeDragStop={(_, __, nodes) => updateNodesPosition(nodes)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {nodes.length === 0 && <NoTable />}
    </div>
  );
};
