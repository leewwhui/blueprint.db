import type { FieldType } from "@/lib/field-type";

export interface IColumn {
  id: string;
  name: string;
  type: FieldType;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
}

export interface IRelation {
  id: string;
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
