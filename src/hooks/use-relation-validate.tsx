import { ColumnConstraints } from "@/lib/field-type";
import { useTables } from "@/store/schema/selector";

export const useRelationValidate = () => {
  const tables = useTables();

  const validateRelation = (
    sourceTableId: string,
    sourceColumnId: string,
    targetTableId: string,
    targetColumnId: string,
  ) => {
    const sourceTable = tables.find((table) => table.id === sourceTableId);
    const targetTable = tables.find((table) => table.id === targetTableId);

    if (!sourceTable) {
      return {
        valid: false,
        message: "Source table not found",
      };
    }

    if (!targetTable) {
      return {
        valid: false,
        message: "Target table not found",
      };
    }

    const sourceColumn = sourceTable.columns.find(
      (col) => col.id === sourceColumnId,
    );
    const targetColumn = targetTable.columns.find(
      (col) => col.id === targetColumnId,
    );

    if (!sourceColumn) {
      return {
        valid: false,
        message: "Source column not found",
      };
    }

    if (!targetColumn) {
      return {
        valid: false,
        message: "Target column not found",
      };
    }

    if (sourceColumn.type !== targetColumn.type) {
      return {
        valid: false,
        message: "Type mismatch: Source and Target must have the same type",
      };
    }

    const isTargetUnique =
      targetColumn.constraints[ColumnConstraints.PRIMARY_KEY] ||
      targetColumn.constraints[ColumnConstraints.UNIQUE];

    if (!isTargetUnique) {
      return {
        valid: false,
        message:
          "Invalid Relation: Target column must be a Primary Key or Unique",
      };
    }

    return {
      valid: true,
      message: "Relation is valid",
    };
  };

  return validateRelation;
};
