import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { IRelation } from "@/contracts/schema";
import { useMemo, type FC } from "react";
import { RelationshipHeader } from "./relationship-header";
import { useTables } from "@/store/schema/selector";
import { RelationshipForm } from "./relationship-form";

interface IRelationshipItemProps {
  relation: IRelation;
}

export const RelationshipItem: FC<IRelationshipItemProps> = (props) => {
  const { relation } = props;
  const tables = useTables();

  const sourceTable = useMemo(() => {
    return tables.find((table) => table.id === relation.sourceTableId);
  }, [tables]);

  const targetTable = useMemo(() => {
    return tables.find((table) => table.id === relation.targetTableId);
  }, [tables]);

  const sourceColumn = useMemo(() => {
    return sourceTable?.columns.find(
      (col) => col.id === relation.sourceColumnId,
    );
  }, [sourceTable]);

  const targetColumn = useMemo(() => {
    return targetTable?.columns.find(
      (col) => col.id === relation.targetColumnId,
    );
  }, [targetTable]);

  const relationName = useMemo(() => {
    if (!sourceTable || !targetTable) return relation.id;
    if (!sourceColumn || !targetColumn) return relation.id;

    return `fk_${sourceTable.name}_${sourceColumn.name}_${targetTable.name}_${targetColumn.name}`;
  }, [sourceTable, sourceColumn, targetTable, targetColumn]);

  if (!sourceColumn || !targetColumn || !sourceTable || !targetTable) {
    return null;
  }

  return (
    <Collapsible className="shadow-md rounded overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
          <RelationshipHeader name={relationName} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-1">
        <RelationshipForm relation={relation} />
      </CollapsibleContent>
    </Collapsible>
  );
};
