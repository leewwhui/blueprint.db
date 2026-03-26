import { useRelations } from "@/store/schema/selector";
import { RelationshipItem } from "./relationship-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLine } from "@tabler/icons-react";

export const RelationshipList = () => {
  const relations = useRelations();

  const onAddRelationship = () => {};

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <Input placeholder="Search relations..." />
        <Button variant="secondary" onClick={onAddRelationship}>
          <IconLine></IconLine>
          Add Relationship
        </Button>
      </div>

      {relations.map((relation) => (
        <RelationshipItem relation={relation} key={relation.id} />
      ))}
    </div>
  );
};
