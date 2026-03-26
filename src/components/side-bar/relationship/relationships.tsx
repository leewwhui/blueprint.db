import { useRelations } from "@/store/schema/selector";
import { RelationshipItem } from "./relationship-item";

export const RelationshipList = () => {
  const relations = useRelations();

  return (
    <div className="flex flex-col gap-3">
      {relations.map((relation) => (
        <RelationshipItem relation={relation} key={relation.id} />
      ))}
    </div>
  );
};
