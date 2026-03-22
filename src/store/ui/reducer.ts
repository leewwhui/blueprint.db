import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUIState } from "./slice";
import type { IVector2 } from "@/contracts/math";

export const selectTableAction = (
  state: IUIState,
  action: PayloadAction<string>,
) => {
  state.selectedTableId = action.payload;
};

export const updateTablePositionAction = (
  state: IUIState,
  action: PayloadAction<{
    tableId: string;
    position: IVector2;
  }>,
) => {
  const { tableId, position } = action.payload;
  state.tablePositions[tableId] = position;
};

export const updateTableColorAction = (
  state: IUIState,
  action: PayloadAction<{
    tableId: string;
    color: string;
  }>,
) => {
  const { tableId, color } = action.payload;
  state.tableColors[tableId] = color;
};
