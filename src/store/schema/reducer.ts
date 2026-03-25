import type { PayloadAction } from "@reduxjs/toolkit";
import type { ISchemaState } from "./slice";
import type { IRelation, ITable } from "@/contracts/schema";

export const importSchemaAction = (
  state: ISchemaState,
  action: PayloadAction<{ tables: ITable[]; relations: IRelation[] }>,
) => {
  state.tables = action.payload.tables;
  state.relations = action.payload.relations;
};

export const addTableAction = (
  state: ISchemaState,
  action: PayloadAction<ITable>,
) => {
  state.tables.push(action.payload);
};

export const updateTableAction = (
  state: ISchemaState,
  action: PayloadAction<ITable>,
) => {
  const updatedTable = action.payload;
  const tableIndex = state.tables.findIndex((t) => t.id === updatedTable.id);
  if (tableIndex !== -1) {
    state.tables[tableIndex] = updatedTable;
  }
};

export const deleteTableAction = (
  state: ISchemaState,
  action: PayloadAction<{ tableId: string }>,
) => {
  const { tableId } = action.payload;
  state.tables = state.tables.filter((t) => t.id !== tableId);
};

export const addRelationAction = (
  state: ISchemaState,
  action: PayloadAction<IRelation>,
) => {
  state.relations.push(action.payload);
};

export const deleteReationsAction = (
  state: ISchemaState,
  action: PayloadAction<{ relationIds: string[] }>,
) => {
  const { relationIds } = action.payload;

  state.relations = state.relations.filter(
    (r) =>
      !relationIds.includes(r.id) && !relationIds.includes(r.targetTableId),
  );
};
