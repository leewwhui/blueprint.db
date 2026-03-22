import type { PayloadAction } from "@reduxjs/toolkit";
import type { ISchemaState } from "./slice";
import type { ITable } from "@/contracts/schema";

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
