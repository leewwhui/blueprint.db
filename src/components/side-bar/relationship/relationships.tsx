import { useRelations } from "@/store/schema/selector";
import { RelationshipItem } from "./relationship-item";
import { Input } from "@/components/ui/input";
import { CreateRelationship } from "./create-relationship";

export const RelationshipList = () => {
  const relations = useRelations();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <Input placeholder="Search relations..." />
        <CreateRelationship />
      </div>

      {relations.map((relation) => (
        <RelationshipItem relation={relation} key={relation.id} />
      ))}
    </div>
  );
};
