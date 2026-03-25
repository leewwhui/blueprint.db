import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState, type FC } from "react";
import { ColumnConstraints, FieldType } from "@/lib/field-type";
import { nanoid } from "nanoid";
import { ColumnForm } from "./column-form";
import type { IColumn, TableFormValues } from "@/contracts/schema";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { tableFormSchema } from "@/components/table-editor/table-validation";
import { ErrorLabel } from "./error-label";

interface TableFormProps extends React.PropsWithChildren {
  tableName: string;
  columns: IColumn[];
  onTableSaved: (table: TableFormValues) => void;
}

export const TableForm: FC<TableFormProps> = (props) => {
  const { children, tableName, columns, onTableSaved } = props;
  const [open, setOpen] = useState(false);

  const initialValues = useMemo<TableFormValues>(
    () => ({
      name: tableName,
      columns: columns.map((column) => ({
        ...column,
        constraints: { ...column.constraints },
      })),
    }),
    [columns, tableName],
  );

  const methods = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: initialValues,
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
        [ColumnConstraints.AUTO_INCREMENT]: false,
      },
    });
  };

  const onSubmit: SubmitHandler<TableFormValues> = (data) => {
    onTableSaved(data);
    setOpen(false);
    methods.reset(initialValues);
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    methods.reset(initialValues);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
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
                  {...methods.register("name")}
                  type="text"
                  placeholder="Enter table name"
                />
                {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
                {errors.columns?.root && (
                  <ErrorLabel>{errors.columns.root.message}</ErrorLabel>
                )}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
};
