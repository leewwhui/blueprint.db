import type { IRelation, ITable } from "@/contracts/schema";
import { ColumnConstraints } from "./field-type";

export const relationValidate = (
  sourceTable: ITable,
  targetTable: ITable,
  sourceColumnId: string,
  targetColumnId: string,
  sourceTableId: string,
  targetTableId: string,
  relations: IRelation[] = [],
) => {
  if (sourceTableId === targetTableId && sourceColumnId === targetColumnId) {
    return {
      valid: false,
      message: "Invalid Relation: Source and target column cannot be the same",
    };
  }

  const hasDuplicateRelation = relations.some(
    (relation) =>
      relation.sourceTableId === sourceTableId &&
      relation.sourceColumnId === sourceColumnId &&
      relation.targetTableId === targetTableId &&
      relation.targetColumnId === targetColumnId,
  );

  if (hasDuplicateRelation) {
    return {
      valid: false,
      message: "Invalid Relation: Duplicate foreign key relation",
    };
  }

  const hasSourceColumnAlreadyLinked = relations.some(
    (relation) =>
      relation.sourceTableId === sourceTableId &&
      relation.sourceColumnId === sourceColumnId,
  );

  if (hasSourceColumnAlreadyLinked) {
    return {
      valid: false,
      message: "Invalid Relation: Source column already has a foreign key",
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
