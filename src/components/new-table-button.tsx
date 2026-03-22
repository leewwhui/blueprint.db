import { IconPlus } from "@tabler/icons-react";
import { TableForm } from "./table-form/table-form";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";
import { FieldType } from "@/lib/field-type";
import { useDispatch } from "react-redux";
import { addTable } from "@/store/schema/slice";
import type { IColumn } from "@/contracts/schema";

export const NewTableButton = () => {
  const createDefaultColumn = () => {
    return {
      id: nanoid(),
      name: "ID",
      type: FieldType.INT,
      isPrimary: true,
      isNullable: false,
      isUnique: true,
    };
  };
  const dispatch = useDispatch();

  const onTableSaved = (tableName: string, columns: IColumn[]) => {
    const table = {
      name: tableName,
      columns,
      id: nanoid(),
    };

    dispatch(addTable(table));
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
