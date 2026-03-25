import { IconPencil, IconX } from "@tabler/icons-react";
import type { NodeProps } from "@xyflow/react";
import { TableForm } from "../table-editor/table-form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { deleteTable, updateTable } from "@/store/schema/slice";
import type { IColumn, TableFormValues } from "@/contracts/schema";
import { ColumnNode } from "./column-node";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { DefaultTableTheme } from "@/lib/colors";

export const TableNode = (props: NodeProps) => {
  const dispatch = useDispatch();
  const tables = useTables();

  const { id, data } = props;
  const name = data.name as string;
  const columns = data.columns as IColumn[];

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      id,
      name: data.name,
      columns: data.columns,
    };

    if (tables.some((t) => t.name === table.name && t.id !== id)) {
      toast.error("Table name must be unique");
      return false;
    }

    dispatch(updateTable(table));
    return true;
  };

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

        <div className="flex">
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
        <ColumnNode key={column.id} tableId={id} column={column} />
      ))}
    </div>
  );
};
