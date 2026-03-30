import { useTables } from "@/store/schema/selector";
import { TableItem } from "./table-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconTable } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { useDispatch } from "react-redux";
import { updateTablePosition } from "@/store/ui/slice";
import { useReactFlow } from "@xyflow/react";
import { useHistory } from "@/hooks/use-history";
import { CreateTableCommand } from "@/commands/CreateTableCommand";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export const TableList = () => {
  const tables = useTables();
  const dispatch = useDispatch();
  const reactFlow = useReactFlow();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    const table = {
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
    history.executeCommand(new CreateTableCommand(table));
    dispatch(updateTablePosition([{ tableId: id, position: canvasCenter }]));
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex gap-1 sticky top-0 bg-background p-3">
        <Input
          placeholder="Search tables..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="secondary" onClick={onAddTable}>
          <IconTable></IconTable>
          Add Table
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3">
        {tables
          .filter((table) =>
            debouncedSearchTerm
              ? table.name
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
              : true,
          )
          .map((table) => (
            <TableItem table={table} key={table.id} />
          ))}
      </div>
    </div>
  );
};
