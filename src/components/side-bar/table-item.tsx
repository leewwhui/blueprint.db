import type { ITable, TableFormValues } from "@/contracts/schema";
import type { FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFocusTable } from "@/hooks/use-focus-table";
import { TableForm } from "../table-editor/table-form";
import { DefaultTableTheme } from "@/lib/colors";
import { Button } from "../ui/button";
import { IconFocus2 } from "@tabler/icons-react";
import { updateTable } from "@/store/schema/slice";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface TableItemProps {
  table: ITable;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table } = props;
  const tables = useTables();
  const dispatch = useDispatch();
  const { focusTable } = useFocusTable();

  const onClickFocusButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusTable(table.id);
  };

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      id: props.table.id,
      name: data.name,
      columns: data.columns,
    };

    if (tables.some((t) => t.name === table.name && t.id !== props.table.id)) {
      toast.error("Table name must be unique");
      return false;
    }

    dispatch(updateTable(table));
    toast.success("Table updated successfully");
    return true;
  };

  return (
    <Collapsible
      className="border-l-4 shadow-md rounded overflow-hidden"
      style={{ borderColor: DefaultTableTheme }}
    >
      <CollapsibleTrigger asChild>
        <div className="w-full truncate line-clamp-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
          {table.name}

          <div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:bg-card"
              onClick={onClickFocusButton}
            >
              <IconFocus2 />
            </Button>
          </div>
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
