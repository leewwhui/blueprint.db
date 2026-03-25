import { createSlice } from "@reduxjs/toolkit";
import { selectTableAction, updateTablePositionAction } from "./reducer";
import type { IVector2 } from "@/contracts/math";

export interface IUIState {
  selectedTableId: string | null;
  tablePositions: Record<string, IVector2>;
}

const initialState: IUIState = {
  selectedTableId: null,
  tablePositions: {},
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectTable: selectTableAction,
    updateTablePosition: updateTablePositionAction,
  },
});

// Action creators are generated for each case reducer function
export const { selectTable, updateTablePosition } = uiSlice.actions;
