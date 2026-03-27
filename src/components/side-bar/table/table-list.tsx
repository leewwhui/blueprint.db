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

export const TableList = () => {
  const tables = useTables();
  const dispatch = useDispatch();

  const onAddTable = () => {
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
