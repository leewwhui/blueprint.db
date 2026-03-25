import { z } from "zod";
import { ColumnConstraints, FieldType } from "../../lib/field-type";

const constraintsSchema = z.object({
  [ColumnConstraints.PRIMARY_KEY]: z.boolean(),
  [ColumnConstraints.NOT_NULL]: z.boolean(),
  [ColumnConstraints.UNIQUE]: z.boolean(),
  [ColumnConstraints.AUTO_INCREMENT]: z.boolean(),
});

const columnSchema = z.object({
  id: z.string().min(1, "Column ID is required"),
  name: z.string().min(1, "Column name is required"),
  type: z.nativeEnum(FieldType),
  constraints: constraintsSchema,
});

export const tableFormSchema = z
  .object({
    name: z.string().min(1, "Table name is required"),
    columns: z.array(columnSchema).min(1, "At least one column is required"),
  })
  .refine(
    (data) => {
      const primaryKeyCount = data.columns.filter(
        (col) => col.constraints[ColumnConstraints.PRIMARY_KEY],
      ).length;

      return primaryKeyCount === 1;
    },
    {
      message: "Exactly one column must be marked as Primary Key",
      path: ["columns", "root"],
    },
  );

export type TableFormSchemaType = z.infer<typeof tableFormSchema>;
