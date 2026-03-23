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
import { ColumnConstraints, FieldType } from "@/lib/field-type";
import { nanoid } from "nanoid";
import { ColumnForm } from "./column-form";
import type { IColumn, ITable } from "@/contracts/schema";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { ErrorLabel } from "./error-label";

interface TableFormProps extends React.PropsWithChildren {
  tableName: string;
  columns: IColumn[];
  onTableSaved: (table: Omit<ITable, "id">) => void;
}

export const TableForm: FC<TableFormProps> = (props) => {
  const { children, tableName, columns, onTableSaved } = props;
  const [open, setOpen] = useState(false);

  const methods = useForm<Omit<ITable, "id">>({
    defaultValues: {
      name: tableName,
      columns: columns,
    },
  });

  const errors = methods.formState.errors;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "columns",
  });

  const createDefaultColumn = () => {
    append({
      id: nanoid(),
      name: "Default",
      type: FieldType.INT,
      constraints: {
        [ColumnConstraints.PRIMARY_KEY]: false,
        [ColumnConstraints.NOT_NULL]: false,
        [ColumnConstraints.UNIQUE]: false,
      },
    });
  };

  const onSubmit: SubmitHandler<Omit<ITable, "id">> = (data) => {
    onTableSaved(data);
    setOpen(false);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Table</DrawerTitle>
        </DrawerHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col justify-between h-full"
          >
            <div className="flex flex-col gap-3 px-4">
              <Field>
                <FieldLabel className="font-bold">Table Name</FieldLabel>
                <Input
                  {...methods.register("name", {
                    required: "Table name is required",
                  })}
                  type="text"
                  placeholder="Enter table name"
                />
                {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
              </Field>

              <Separator />

              <FieldLabel className="font-bold">Columns</FieldLabel>

              {fields.map((column, index) => (
                <ColumnForm
                  key={column.id}
                  index={index}
                  column={column}
                  onColumnDelete={remove}
                />
              ))}

              <Button
                variant="outline"
                onClick={createDefaultColumn}
                type="button"
              >
                <IconPlus />
                Add Column
              </Button>
            </div>
            <DrawerFooter>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save</Button>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};
