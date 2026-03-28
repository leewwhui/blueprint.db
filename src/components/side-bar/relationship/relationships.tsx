import { useRelations } from "@/store/schema/selector";
import { RelationshipItem } from "./relationship-item";
import { Input } from "@/components/ui/input";
import { CreateRelationship } from "./create-relationship";

export const RelationshipList = () => {
  const relations = useRelations();

  return (
    <div className="flex flex-col relative">
      <div className="flex gap-1 sticky top-0 bg-background p-3">
        <Input placeholder="Search relations..." />
        <CreateRelationship />
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3">
        {relations.map((relation) => (
          <RelationshipItem relation={relation} key={relation.id} />
        ))}
      </div>
    </div>
  );
};
