import type { FieldType } from "@/lib/field-type";

export interface IColumn {
  id: string;
  name: string;
  type: FieldType;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
}

export interface ITable {
  id: string;
  name: string;
  columns: IColumn[];
}

// interface TableNodeData extends Record<string, unknown> {
//   id: string;
//   name: string;
//   columns: IColumn[];
// }

export type TableNodeData = ITable & Record<string, unknown>;