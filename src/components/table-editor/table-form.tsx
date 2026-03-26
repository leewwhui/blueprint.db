import { IconPlus } from "@tabler/icons-react";
import { type FC } from "react";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { nanoid } from "nanoid";
import { ColumnForm } from "./column-form";
import type { IColumn, TableFormValues } from "@/contracts/schema";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tableFormSchema } from "@/components/table-editor/table-validation";
import { cloneDeep } from "lodash";

interface TableFormProps extends React.PropsWithChildren {
  tableName: string;
  columns: IColumn[];
  onTableSaved: (table: TableFormValues) => boolean;
}

export const TableForm: FC<TableFormProps> = (props) => {
  const { tableName, columns, onTableSaved } = props;

  const methods = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      name: tableName,
      columns: cloneDeep(columns),
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onTableSaved)}
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

        <Button
          variant="ghost"
          onClick={createDefaultColumn}
          type="button"
          className="w-fit"
          size="sm"
        >
          <IconPlus />
          Add Column
        </Button>

        <Button variant="outline" type="submit">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};
