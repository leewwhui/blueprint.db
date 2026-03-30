import {
  IconCheck,
  IconFocus2,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import type { ITable } from "@/contracts/schema";
import { Fragment, useState, type FC } from "react";
import { useFocusTable } from "@/hooks/use-focus-table";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { DeleteTableCommand } from "@/commands/DeleteTableCommand";
import { UpdateTableCommand } from "@/commands/UpdateTableCommand";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface TableItemHeaderProps {
  table: ITable;
}

export const TableItemHeader: FC<TableItemHeaderProps> = (props) => {
  const { table } = props;
  const tables = useTables();
  const history = useHistory();
  const { focusTable } = useFocusTable();
  const [isEditing, setIsEditing] = useState(false);
  const [tableName, setTableName] = useState(table.name);

  const onClickFocusButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusTable(table.id);
  };

  const onEditTableName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const onDeleteTable = (e: React.MouseEvent) => {
    e.stopPropagation();
    history.executeCommand(new DeleteTableCommand(table));
  };

  const onTableNameSave = (name: string) => {
    if (tables.some((t) => t.name === name && t.id !== props.table.id)) {
      toast.error("Table name must be unique");
      return false;
    }

    if (table.name === name) {
      setIsEditing(false);
    }

    history.executeCommand(new UpdateTableCommand(table, { ...table, name }));
    setIsEditing(false);
  };

  const onTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTableName(e.target.value);
  };

  return (
    <div className="group w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
      {!isEditing && (
        <Fragment>
          <p className="truncate">{table.name}</p>
          <div className="invisible flex opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:bg-card"
              onClick={onEditTableName}
            >
              <IconPencil />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:bg-card"
              onClick={onClickFocusButton}
            >
              <IconFocus2 />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:bg-card"
              onClick={onDeleteTable}
            >
              <IconTrash />
            </Button>
          </div>
        </Fragment>
      )}

      {isEditing && (
        <Fragment>
          <Input
            value={tableName}
            onChange={onTableNameChange}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            size="icon-sm"
            variant="ghost"
            className="hover:bg-card"
            onClick={(e) => {
              e.stopPropagation();
              onTableNameSave(tableName);
            }}
          >
            <IconCheck />
          </Button>
        </Fragment>
      )}
    </div>
  );
};
