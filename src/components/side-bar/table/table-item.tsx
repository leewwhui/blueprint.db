import type { ITable, TableFormValues } from "@/contracts/schema";
import { useState, type FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableForm } from "../../table-editor/table-form";
import { DefaultTableTheme } from "@/lib/colors";
import { updateTable } from "@/store/schema/slice";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableNameEditing } from "./table-name-editing";
import { TableItemHeader } from "./table-item-header";

interface TableItemProps {
  table: ITable;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table } = props;
  const tables = useTables();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      id: props.table.id,
      name: data.name,
      columns: data.columns,
    };

    dispatch(updateTable(table));
    toast.success("Table updated successfully");
    return true;
  };

  const onTableNameSave = (name: string) => {
    if (tables.some((t) => t.name === name && t.id !== props.table.id)) {
      toast.error("Table name must be unique");
      return false;
    }

    dispatch(updateTable({ ...table, name }));

    setIsEditing(false);
    toast.success("Table name updated successfully");
  };

  const onEditTableName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <Collapsible
      className="border-l-4 shadow-md rounded overflow-hidden"
      style={{ borderColor: DefaultTableTheme }}
    >
      <CollapsibleTrigger asChild>
        <div className="w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
          {isEditing ? (
            <TableNameEditing
              name={props.table.name}
              onSave={onTableNameSave}
            />
          ) : (
            <TableItemHeader table={table} onEditingTableName={onEditTableName} />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-1">
        <TableForm
          tableName={table.name}
          columns={table.columns}
          onTableSaved={onTableSaved}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
