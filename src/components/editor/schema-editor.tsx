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
import { useRelations, useTables } from "@/store/schema/selector";
import { relationValidate } from "@/lib/relation-validate";

export const SchemaEditor = () => {
  const { nodes, onNodesChange } = useTableNodes();
  const { edges, onEdgesChange } = useTableRelations();

  const tables = useTables();
  const relations = useRelations();

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

    const sourceTableId = connection.source;
    const sourceColumnId = connection.sourceHandle;
    const targetTableId = connection.target;
    const targetColumnId = connection.targetHandle;

    const sourceTable = tables.find((table) => table.id === sourceTableId);
    const targetTable = tables.find((table) => table.id === targetTableId);

    if (!sourceTable) {
      return {
        valid: false,
        message: "Source table not found",
      };
    }

    if (!targetTable) {
      return {
        valid: false,
        message: "Target table not found",
      };
    }

    const validation = relationValidate(
      sourceTable,
      targetTable,
      sourceColumnId,
      targetColumnId,
      sourceTableId,
      targetTableId,
      relations,
    );

    const sourceColumn = sourceTable.columns.find(
      (col) => col.id === sourceColumnId,
    );
    const targetColumn = targetTable.columns.find(
      (col) => col.id === targetColumnId,
    );

    const relation = {
      id: nanoid(),
      name: `fk_${sourceTable.name}_${sourceColumn!.name}_${targetTable.name}_${targetColumn!.name}`,
      sourceTableId,
      sourceColumnId,
      targetTableId,
      targetColumnId,
    };

    if (!validation.valid) {
      return toast.error(validation.message);
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
        onPaneContextMenu={(e) => e.preventDefault()}
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
