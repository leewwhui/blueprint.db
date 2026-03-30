import { useRelations } from "@/store/schema/selector";
import { RelationshipItem } from "./relationship-item";
import { Input } from "@/components/ui/input";
import { CreateRelationship } from "./create-relationship";
import { useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useTables } from "@/store/schema/selector";
import { getRelationShipName } from "@/lib/relation-name";

export const RelationshipList = () => {
  const relations = useRelations();
  const tables = useTables();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredRelations = useMemo(() => {
    const keyword = debouncedSearchTerm?.toLowerCase().trim();

    return relations
      .filter((relation) => {
        if (!keyword) {
          return true;
        }

        const relationName = getRelationShipName(tables, relation);

        return relationName?.toLowerCase().includes(keyword) ?? false;
      })
      .map((relation) => ({
        relation,
        name: getRelationShipName(tables, relation) ?? relation.id,
      }));
  }, [debouncedSearchTerm, relations, tables]);

  return (
    <div className="flex flex-col relative">
      <div className="flex gap-1 sticky top-0 bg-background p-3">
        <Input
          placeholder="Search relations..."
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <CreateRelationship />
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3">
        {filteredRelations.map((filteredRelation) => {
          const { relation, name } = filteredRelation;

          const primaryTable = tables.find(
            (t) => t.id === relation.targetTableId,
          );
          const foreignTable = tables.find(
            (t) => t.id === relation.sourceTableId,
          );
          if (!primaryTable || !foreignTable) return null;

          return (
            <RelationshipItem
              key={relation.id}
              relation={relation}
              relationName={name}
              primaryTable={primaryTable}
              foreignTable={foreignTable}
            />
          );
        })}
      </div>
    </div>
  );
};
