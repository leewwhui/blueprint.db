import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUIState } from "./slice";
import type { IVector2 } from "@/contracts/math";

export type TablePositionUpdate = {
  tableId: string;
  position: IVector2;
};

export const selectTableAction = (
  state: IUIState,
  action: PayloadAction<string | null>,
) => {
  state.selectedTableId = action.payload;
};

export const selectRelationAction = (
  state: IUIState,
  action: PayloadAction<string | null>,
) => {
  state.selectedRelationId = action.payload;
};

export const updateTablePositionAction = (
  state: IUIState,
  action: PayloadAction<TablePositionUpdate[]>,
) => {
  action.payload.forEach(({ tableId, position }) => {
    state.tablePositions[tableId] = position;
  });
};
