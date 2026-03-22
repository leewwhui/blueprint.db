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
  // position: { x: number; y: number };
}
