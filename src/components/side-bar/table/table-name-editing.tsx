import { Fragment, useState, type FC } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { IconCheck } from "@tabler/icons-react";

interface TableNameEditingProps {
  name: string;
  onSave: (name: string) => void;
}

export const TableNameEditing: FC<TableNameEditingProps> = (props) => {
  const { name, onSave } = props;
  const [tableName, setTableName] = useState(name);

  const onTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTableName(e.target.value);
  };

  return (
    <div className="w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
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
          onSave(tableName);
        }}
      >
        <IconCheck />
      </Button>
    </div>
  );
};
