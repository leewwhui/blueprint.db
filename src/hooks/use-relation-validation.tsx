import { relationValidate } from "@/lib/relation-validate";
import { useRelations, useTables } from "@/store/schema/selector";

export const useRelationValidate = () => {
  const tables = useTables();
  const relations = useRelations();

  return (
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

    return relationValidate(
      sourceTable,
      targetTable,
      sourceColumnId,
      targetColumnId,
      sourceTableId,
      targetTableId,
      relations,
    );
  };
};
