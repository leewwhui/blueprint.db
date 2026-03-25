import { IconPlus } from "@tabler/icons-react";
import { TableForm } from "../table-editor/table-form";
import { Button } from "../ui/button";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { addTable } from "@/store/schema/slice";
import type { TableFormValues } from "@/contracts/schema";
import { useTables } from "@/store/schema/selector";
import toast from "react-hot-toast";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";

export const NewTable = () => {
  const tables = useTables();

  const createDefaultColumn = () => {
    return {
      id: nanoid(),
      name: "ID",
      type: ColumnType.INT,
      constraints: {
        [ColumnConstraints.PRIMARY_KEY]: true,
        [ColumnConstraints.NOT_NULL]: true,
        [ColumnConstraints.UNIQUE]: false,
        [ColumnConstraints.AUTO_INCREMENT]: true,
      },
    };
  };
  const dispatch = useDispatch();

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      name: data.name,
      columns: data.columns,
      id: nanoid(),
    };

    if (tables.some((t) => t.name === table.name)) {
      toast.error("Table name must be unique");
      return false;
    }

    dispatch(addTable(table));
    return true;
  };

  return (
    <TableForm
      tableName="New Table"
      columns={[createDefaultColumn()]}
      onTableSaved={onTableSaved}
    >
      <Button variant="outline">
        <IconPlus />
        New Table
      </Button>
    </TableForm>
  );
};
