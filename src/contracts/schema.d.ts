import type { ColumnType, ColumnConstraints } from "@/contracts/columns";

export interface IColumn {
  id: string;
  name: string;
  type: ColumnType;
  constraints: {
    [key in ColumnConstraints]: boolean;
  };
}

export interface IRelation {
  id: string;
  name: string;
  sourceTableId: string;
  sourceColumnId: string;
  targetTableId: string;
  targetColumnId: string;
}

export interface ITable {
  id: string;
  name: string;
  columns: IColumn[];
}

export type TableNodeData = ITable & Record<string, unknown>;
export type TableFormValues = Omit<ITable, "id">;
