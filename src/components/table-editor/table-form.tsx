import { IconPlus } from "@tabler/icons-react";
import { useMemo, type FC } from "react";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { nanoid } from "nanoid";
import { ColumnForm } from "./column-form";
import type { IColumn, TableFormValues } from "@/contracts/schema";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tableFormSchema } from "@/components/table-editor/table-validation";

interface TableFormProps extends React.PropsWithChildren {
  tableName: string;
  columns: IColumn[];
  onTableSaved: (table: TableFormValues) => boolean;
}

export const TableForm: FC<TableFormProps> = (props) => {
  const { tableName, columns, onTableSaved } = props;

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
      name: "",
      type: ColumnType.INT,
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
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full gap-3 p-2"
      >
        <FieldLabel className="font-bold text-xs">Columns</FieldLabel>
        {errors.columns?.root && (
          <p className="text-destructive">{errors.columns.root.message}</p>
        )}

        {fields.map((column, index) => (
          <ColumnForm
            key={column.id}
            index={index}
            column={column}
            onColumnDelete={remove}
          />
        ))}

        <Button variant="outline" onClick={createDefaultColumn} type="button">
          <IconPlus />
          Add Column
        </Button>

        <Button type="submit">Save Table</Button>
      </form>
    </FormProvider>
  );
};
