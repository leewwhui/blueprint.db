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
import { useSelected } from "@/store/ui/selector";

interface TableItemProps {
  table: ITable;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table } = props;

  const selected = useSelected();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isSelected = selected.tableId === table.id;

    if (!isSelected) {
      return;
    }

    setOpen(isSelected);

    scrollTo({
      left: 0,
      top: containerRef.current?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }, [selected]);

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
