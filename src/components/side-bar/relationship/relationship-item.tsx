import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { IRelation, ITable } from "@/contracts/schema";
import { type FC, useEffect, useRef, useState } from "react";
import { RelationshipHeader } from "./relationship-header";
import { RelationshipForm } from "./relationship-form";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useWindowScroll } from "@uidotdev/usehooks";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";

interface IRelationshipItemProps {
  relation: IRelation;
  relationName: string;
  active: boolean;
  primaryTable?: ITable;
  foreignTable?: ITable;
}

export const RelationshipItem: FC<IRelationshipItemProps> = (props) => {
  const { relation, relationName, active, primaryTable, foreignTable } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [_, scrollTo] = useWindowScroll();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(active);

    if (!active) {
      return;
    }

    scrollTo({
      left: 0,
      top: containerRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }, [active]);

  const onSelectTable = (tableId: string) => {
    dispatch(selectTable(tableId));
  };

  if (!primaryTable || !foreignTable) return null;

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
          <div className="p-2 flex flex-col gap-3">
            <div className="flex gap-1">
              <Field>
                <FieldLabel className="text-xs font-bold">
                  Primary Table
                </FieldLabel>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex justify-start"
                  onClick={() => onSelectTable(primaryTable.id)}
                >
                  {primaryTable.name}
                </Button>
              </Field>

              <Field>
                <FieldLabel className="text-xs font-bold">
                  Foreign Table
                </FieldLabel>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex justify-start"
                  onClick={() => onSelectTable(foreignTable.id)}
                >
                  {foreignTable.name}
                </Button>
              </Field>
            </div>
            <Separator />
            <RelationshipForm relation={relation} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
