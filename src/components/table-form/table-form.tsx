import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconPlus } from "@tabler/icons-react";
import { useState, type FC } from "react";
import { FieldType } from "@/lib/field-type";
import { nanoid } from "nanoid";
import { validateTable } from "@/lib/validate";
import { toast } from "sonner";
import { ColumnForm } from "./column-form";
import type { IColumn } from "@/contracts/schema";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface TableFormProps extends React.PropsWithChildren {
  tableName: string;
  columns: IColumn[];
  onTableSaved: (tableName: string, columns: IColumn[]) => void;
}

export const TableForm: FC<TableFormProps> = (props) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState(props.tableName);
  const [columns, setColumns] = useState<IColumn[]>(props.columns);

  const onColumnChange = (column: IColumn) => {
    setColumns(columns.map((c) => (c.id === column.id ? column : c)));
  };

  const onColumnDelete = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
  };

  const onSaveForm = () => {
    const validationResult = validateTable(tableName, columns);

    if (!validationResult.valid) {
      return toast.error(validationResult.message);
    }

    setOpen(false);

    props.onTableSaved(tableName, columns);
  };

  const createDefaultColumn = () => {
    setColumns([
      ...columns,
      {
        id: nanoid(),
        name: "Default Column",
        type: FieldType.INT,
        isPrimary: false,
        isNullable: false,
        isUnique: false,
      },
    ]);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Table</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4">
          <Field>
            <FieldLabel className="font-bold">Table Name</FieldLabel>
            <Input
              type="text"
              placeholder="Enter table name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </Field>

          <Separator />

          <FieldLabel className="font-bold">Columns</FieldLabel>

          {columns.map((column) => (
            <ColumnForm
              key={column.id}
              column={column}
              onColumnDelete={onColumnDelete}
              onColumnChange={onColumnChange}
            />
          ))}

          <Button variant="outline" onClick={createDefaultColumn}>
            <IconPlus />
            Add Column
          </Button>
        </div>
        <DrawerFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={onSaveForm}>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
