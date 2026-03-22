import { IconKey, IconPencil, IconX } from "@tabler/icons-react";
import type { NodeProps } from "@xyflow/react";
import { TableForm } from "../table-form/table-form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { deleteTable, updateTable } from "@/store/schema/slice";
import type { IColumn } from "@/contracts/schema";
import { Position, useConnection } from "@xyflow/react";
import { ColumnHandle } from "./column-handle";

export const TableNode = (props: NodeProps) => {
  const connection = useConnection();
  const dispatch = useDispatch();

  const id = props.id as string;
  const name = props.data.name as string;
  const columns = props.data.columns as IColumn[];

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  const onTableSaved = (tableName: string, columns: IColumn[]) => {
    const table = {
      id: props.id,
      name: tableName,
      columns,
    };

    dispatch(updateTable(table));
  };

  const onDeleteTable = () => {
    dispatch(deleteTable({ tableId: props.id }));
  };

  return (
    <div className="border text-sm w-(--node-width) overflow-hidden rounded">
      <div className="bg-[#316794] text-neutral-50 p-2 font-bold flex items-center justify-between">
        {name}

        <div>
          <TableForm
            tableName={name}
            columns={columns}
            onTableSaved={onTableSaved}
          >
            <Button variant="ghost" size="icon-sm">
              <IconPencil />
            </Button>
          </TableForm>

          <Button variant="ghost" size="icon-sm" onClick={onDeleteTable}>
            <IconX />
          </Button>
        </div>
      </div>
      {columns.map((column) => (
        <div
          key={column.id}
          className="px-2 py-1 flex items-center justify-between bg-accent relative"
        >
          <div>{column.name}</div>

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
      ))}
    </div>
  );
};
