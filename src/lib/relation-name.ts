import type { IRelation, ITable } from "@/contracts/schema";

export const getRelationShipName = (tables: ITable[], relation: IRelation) => {
  const sourceTable = tables.find(
    (table) => table.id === relation.sourceTableId,
  );
  const targetTable = tables.find(
    (table) => table.id === relation.targetTableId,
  );

  if (!sourceTable || !targetTable) return null;

  const sourceColumn = sourceTable.columns.find(
    (col) => col.id === relation.sourceColumnId,
  );
  const targetColumn = targetTable.columns.find(
    (col) => col.id === relation.targetColumnId,
  );

  if (!sourceColumn || !targetColumn) return null;

  return `fk_${sourceTable.name}_${sourceColumn.name}_${targetTable.name}_${targetColumn.name}`;
};
