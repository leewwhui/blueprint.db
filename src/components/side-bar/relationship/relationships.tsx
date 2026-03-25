import { Input } from "../../ui/input";
import { useRelations } from "@/store/schema/selector";
import { Button } from "../../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { RelationshipItem } from "./relationship-item";

export const RelationshipList = () => {
  const relations = useRelations();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input placeholder="Search relations..." />
        <Button variant="secondary" className="text-xs">
          <IconPlus />
          Add Relationship
        </Button>
      </div>
      {relations.map((relation) => (
        <RelationshipItem relation={relation} key={relation.id} />
      ))}
    </div>
  );
};
