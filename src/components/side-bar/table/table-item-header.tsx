import { IconFocus2, IconPencil } from "@tabler/icons-react";
import { Button } from "../../ui/button";
import { Fragment } from "react/jsx-runtime";
import type { ITable } from "@/contracts/schema";
import type { FC } from "react";
import { useFocusTable } from "@/hooks/use-focus-table";

interface TableItemHeaderProps {
  table: ITable;
  onEditingTableName: (e: React.MouseEvent) => void;
}

export const TableItemHeader: FC<TableItemHeaderProps> = (props) => {
  const { table, onEditingTableName } = props;
  const { focusTable } = useFocusTable();

  const onClickFocusButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusTable(table.id);
  };
  return (
    <Fragment>
      <p>{table.name}</p>
      <div>
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
      </div>
    </Fragment>
  );
};
