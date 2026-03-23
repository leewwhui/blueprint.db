import { IconPlus } from "@tabler/icons-react";
import { TableForm } from "./table-form/table-form";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";
import { FieldType } from "@/lib/field-type";
import { useDispatch } from "react-redux";
import { addTable } from "@/store/schema/slice";
import type { TableFormValues } from "@/contracts/schema";

export const NewTable = () => {
  const createDefaultColumn = () => {
    return {
      id: nanoid(),
      name: "ID",
      type: FieldType.INT,
      constraints: {
        PRIMARY_KEY: true,
        NOT_NULL: true,
        UNIQUE: false,
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
