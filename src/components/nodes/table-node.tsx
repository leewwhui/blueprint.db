import { IconX } from "@tabler/icons-react";
import type { NodeProps } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { deleteTable } from "@/store/schema/slice";
import type { IColumn } from "@/contracts/schema";
import { ColumnNode } from "./column-node";
import { DefaultTableTheme } from "@/lib/colors";

export const TableNode = (props: NodeProps) => {
  const dispatch = useDispatch();

  const { id, data } = props;
  const name = data.name as string;
  const columns = data.columns as IColumn[];

  const onDeleteTable = () => {
    dispatch(deleteTable({ tableId: id }));
  };

  return (
    <div className="border text-sm w-(--node-width) overflow-hidden rounded">
      <div
        className="text-neutral-50 p-2 font-bold flex items-center justify-between"
        style={{ backgroundColor: DefaultTableTheme }}
      >
        <p className="truncate">{name}</p>

        <Button variant="ghost" size="icon-sm" onClick={onDeleteTable}>
          <IconX />
        </Button>
      </div>
      {columns.map((column) => (
        <ColumnNode key={column.id} tableId={id} column={column} />
      ))}
    </div>
  );
};
