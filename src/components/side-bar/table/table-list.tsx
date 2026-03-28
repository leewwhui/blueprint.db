import { useTables } from "@/store/schema/selector";
import { TableItem } from "./table-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconTable } from "@tabler/icons-react";
import type { ITable } from "@/contracts/schema";
import { nanoid } from "nanoid";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { useDispatch } from "react-redux";
import { addTable } from "@/store/schema/slice";
import { updateTablePosition } from "@/store/ui/slice";
import { useReactFlow } from "@xyflow/react";

export const TableList = () => {
  const tables = useTables();
  const dispatch = useDispatch();
  const reactFlow = useReactFlow();

  const onAddTable = () => {
    const reactFlowCanvas = document.querySelector(".react-flow");
    if (!(reactFlowCanvas instanceof HTMLElement)) {
      return;
    }

    const canvasRect = reactFlowCanvas.getBoundingClientRect();
    const canvasCenter = reactFlow.screenToFlowPosition({
      x: canvasRect.left + canvasRect.width / 2,
      y: canvasRect.top + canvasRect.height / 2,
    });

    const id = nanoid();
    const table: ITable = {
      id,
      name: `Table_${id.slice(0, 6)}`,
      columns: [
        {
          id: nanoid(),
          name: "id",
          type: ColumnType.INT,
          constraints: {
            [ColumnConstraints.PRIMARY_KEY]: true,
            [ColumnConstraints.NULLABLE]: false,
            [ColumnConstraints.UNIQUE]: false,
            [ColumnConstraints.AUTO_INCREMENT]: true,
          },
        },
      ],
    };
    dispatch(addTable(table));
    dispatch(
      updateTablePosition([
        { tableId: id, position: canvasCenter },
      ]),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <Input placeholder="Search tables..." />
        <Button variant="secondary" onClick={onAddTable}>
          <IconTable></IconTable>
          Add Table
        </Button>
      </div>
      {tables.map((table) => (
        <TableItem table={table} key={table.id} />
      ))}
    </div>
  );
};
