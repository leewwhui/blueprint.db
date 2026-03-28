import type { ITable, TableFormValues } from "@/contracts/schema";
import { useEffect, useRef, useState, type FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableForm } from "../../table-form/table-form";
import { DefaultTableTheme } from "@/lib/colors";
import { updateTable } from "@/store/schema/slice";
import { useDispatch } from "react-redux";
import { TableItemHeader } from "./table-item-header";

interface TableItemProps {
  table: ITable;
  active: boolean;
}

export const TableItem: FC<TableItemProps> = (props) => {
  const { table, active } = props;
  const dispatch = useDispatch();
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

  const onTableSaved = (data: TableFormValues) => {
    const table = {
      id: props.table.id,
      name: data.name,
      columns: data.columns,
    };

    dispatch(updateTable(table));
    return true;
  };

  return (
    <div ref={containerRef} className="scroll-mt-20">
      <Collapsible
        className="border-l-4 rounded overflow-hidden shadow-md"
        style={{ borderColor: DefaultTableTheme }}
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <TableItemHeader table={table} />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-1">
          <TableForm
            tableName={table.name}
            columns={table.columns}
            onTableSaved={onTableSaved}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
