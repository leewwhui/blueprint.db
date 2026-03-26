import type { IRelation } from "@/contracts/schema";
import { useTables } from "@/store/schema/selector";
import { useMemo } from "react";

export const useRelationShipName = (relation: IRelation) => {
  const tables = useTables();

  return useMemo(() => {
    const sourceTable = tables.find(
      (table) => table.id === relation.sourceTableId,
    );
    const targetTable = tables.find(
      (table) => table.id === relation.targetTableId,
    );

    if (!sourceTable || !targetTable) return relation.id;

    const sourceColumn = sourceTable.columns.find(
      (col) => col.id === relation.sourceColumnId,
    );
    const targetColumn = targetTable.columns.find(
      (col) => col.id === relation.targetColumnId,
    );

    if (!sourceColumn || !targetColumn) return relation.id;

    return `fk_${sourceTable.name}_${sourceColumn.name}_${targetTable.name}_${targetColumn.name}`;
  }, [relation, tables]);
};
