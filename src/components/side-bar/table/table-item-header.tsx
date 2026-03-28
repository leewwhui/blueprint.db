import { IconFocus2, IconPencil, IconTrash } from "@tabler/icons-react";
import type { ITable } from "@/contracts/schema";
import type { FC } from "react";
import { useFocusTable } from "@/hooks/use-focus-table";
import { Button } from "@/components/ui/button";

interface TableItemHeaderProps {
  table: ITable;
  onEditingTableName: (e: React.MouseEvent) => void;
  onDeleteTable: (e: React.MouseEvent) => void;
}

export const TableItemHeader: FC<TableItemHeaderProps> = (props) => {
  const { table, onEditingTableName, onDeleteTable } = props;
  const { focusTable } = useFocusTable();

  const onClickFocusButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusTable(table.id);
  };

  return (
    <div className="group w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
      <p className="truncate">{table.name}</p>
      <div className="invisible flex opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
        <Button
          size="icon-sm"
          variant="ghost"
          className="hover:bg-card"
          onClick={onEditingTableName}
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
    </div>
  );
};
