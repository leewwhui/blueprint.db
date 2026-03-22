import type { IColumn } from "@/contracts/schema";
import { IconKey } from "@tabler/icons-react";
import type { FC } from "react";
import { ColumnHandle } from "./column-handle";
import { Position, useConnection } from "@xyflow/react";

interface ColumnNodeProps {
  tableId: string;
  column: IColumn;
}

export const ColumnNode: FC<ColumnNodeProps> = (props) => {
  const { column, tableId } = props;
  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== tableId;

  return (
    <div
      key={column.id}
      className="px-2 py-1 flex items-center justify-between bg-accent relative border-t"
    >
      <p className="truncate line-clamp-1">{column.name}</p>

      <div className="flex items-center gap-1">
        {column.isPrimary && <IconKey size="16" />}
        <div className="text-xs">{column.type}</div>
      </div>

      {!connection.inProgress && (
        <ColumnHandle
          id={`${column.id}-source`}
          column={column}
          type="source"
          position={Position.Right}
        />
      )}

      {(!connection.inProgress || isTarget) && (
        <ColumnHandle
          id={`${column.id}-target`}
          column={column}
          type="target"
          position={Position.Left}
          isConnectableStart={false}
        />
      )}
    </div>
  );
};
