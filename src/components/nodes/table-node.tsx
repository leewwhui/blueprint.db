import type { NodeProps } from "@xyflow/react";
import type { IColumn } from "@/contracts/schema";
import { ColumnNode } from "./column-node";
import { DefaultTableTheme } from "@/lib/colors";
import React from "react";

export const TableNode = React.memo((props: NodeProps) => {
  const { id, data } = props;
  const name = data.name as string;
  const columns = data.columns as IColumn[];

  return (
    <div className="border text-sm w-(--node-width) overflow-hidden rounded">
      <div
        className="text-neutral-50 p-2 font-bold flex items-center justify-between"
        style={{ backgroundColor: DefaultTableTheme }}
      >
        <p className="truncate">{name}</p>
      </div>
      {columns.map((column) => (
        <ColumnNode key={column.id} tableId={id} column={column} />
      ))}
    </div>
  );
});
