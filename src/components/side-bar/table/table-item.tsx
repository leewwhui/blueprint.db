import type { ITable, TableFormValues } from "@/contracts/schema";
import { useEffect, useRef, useState, type FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableForm } from "../../table-form/table-form";
import { DefaultTableTheme } from "@/lib/colors";
import { updateTable } from "@/store/schema/slice";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableNameEditing } from "./table-name-editing";
import { TableItemHeader } from "./table-item-header";
import { useHistory } from "@/hooks/use-history";
import { DeleteTableCommand } from "@/commands/DeleteTableCommand";

interface TableItemProps {
  table: ITable;
  active: boolean;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table, active } = props;
  const tables = useTables();
  const dispatch = useDispatch();
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(active);

    if (!active) {
      return;
    }

    containerRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [active]);

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      id: props.table.id,
      name: data.name,
      columns: data.columns,
    };

    dispatch(updateTable(table));
    return true;
  };

  const onTableNameSave = (name: string) => {
    if (tables.some((t) => t.name === name && t.id !== props.table.id)) {
      toast.error("Table name must be unique");
      return false;
    }

    dispatch(updateTable({ ...table, name }));
    setIsEditing(false);
  };

  const onEditTableName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const onDeleteTable = (e: React.MouseEvent) => {
    e.stopPropagation();
    history.executeCommand(new DeleteTableCommand(table));
  };

  return (
    <div ref={containerRef} className="scroll-mt-20">
      <Collapsible
        className="border-l-4 rounded overflow-hidden shadow-md"
        style={{ borderColor: DefaultTableTheme }}
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <div>
            {isEditing ? (
              <TableNameEditing
                name={props.table.name}
                onSave={onTableNameSave}
              />
            ) : (
              <TableItemHeader
                table={table}
                onEditingTableName={onEditTableName}
                onDeleteTable={onDeleteTable}
              />
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
    </div>
  );
};
