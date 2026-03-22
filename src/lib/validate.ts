import type { IColumn } from "@/contracts/schema";

export const validateTable = (name: string, columns: IColumn[]) => {
  // Validate table name
  if (!name || name.trim() === "") {
    return { valid: false, message: "Table name cannot be empty." };
  }

  // Validate each field
  for (const field of columns) {
    if (!field.name || field.name.trim() === "") {
      return { valid: false, message: "Field name cannot be empty." };
    }
    if (!field.type || field.type.trim() === "") {
      return { valid: false, message: "Field type cannot be empty." };
    }
  }

  // Validate primary key constraints
  const primaryKeys = columns.filter((column) => column.isPrimary);

  if (primaryKeys.length === 0) {
    return { valid: false, message: "At least one primary key is required." };
  }

  if (primaryKeys.length > 1) {
    return { valid: false, message: "Only one primary key is allowed." };
  }

  // Validate primary key nullability
  if (primaryKeys.length === 1 && primaryKeys[0].isNullable) {
    return { valid: false, message: "Primary key cannot be nullable." };
  }

  return { valid: true };
};
