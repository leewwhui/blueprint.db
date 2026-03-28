import type { ITable } from "@/contracts/schema";
import { useEffect, useRef, useState, type FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableForm } from "../../table-form/table-form";
import { DefaultTableTheme } from "@/lib/colors";
import { TableItemHeader } from "./table-item-header";

interface TableItemProps {
  table: ITable;
  active: boolean;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table, active } = props;
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
        className="border-l-4 rounded overflow-hidden shadow-md"
        style={{ borderColor: DefaultTableTheme }}
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <div>
            <TableItemHeader table={table} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1">
          <TableForm table={table} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
