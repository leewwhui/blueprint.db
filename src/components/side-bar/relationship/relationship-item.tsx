import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { IRelation } from "@/contracts/schema";
import { type FC, useEffect, useRef, useState } from "react";
import { RelationshipHeader } from "./relationship-header";
import { RelationshipForm } from "./relationship-form";

interface IRelationshipItemProps {
  relation: IRelation;
  relationName: string;
  active: boolean;
}

export const RelationshipItem: FC<IRelationshipItemProps> = (props) => {
  const { relation, relationName, active } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(active);

    if (!active) {
      return;
    }

    containerRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div ref={containerRef} className="scroll-mt-20">
      <Collapsible
        className="shadow-md rounded overflow-hidden"
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <div className="w-full truncate line-clamp-1 gap-1 text-start p-2 hover:bg-accent flex items-center justify-between cursor-pointer">
            <RelationshipHeader name={relationName} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1">
          <RelationshipForm relation={relation} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
