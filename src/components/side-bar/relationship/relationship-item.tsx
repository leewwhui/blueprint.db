import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { IRelation } from "@/contracts/schema";
import type { FC } from "react";
import { RelationshipHeader } from "./relationship-header";

interface IRelationshipItemProps {
  relation: IRelation;
}

export const RelationshipItem: FC<IRelationshipItemProps> = (props) => {
  const { relation } = props;

  return (
    <Collapsible className="shadow-md rounded overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
          <RelationshipHeader relation={relation} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-1">Hello world</CollapsibleContent>
    </Collapsible>
  );
};
