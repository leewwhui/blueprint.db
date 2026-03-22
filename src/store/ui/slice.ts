import { createSlice } from "@reduxjs/toolkit";
import { selectTableAction, updateTablePositionAction } from "./reducer";

export interface IUIState {
  selectedTableId: string | null;
  tablePositions: Record<string, { x: number; y: number }>;
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
