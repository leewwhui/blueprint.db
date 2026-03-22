import { createSlice } from "@reduxjs/toolkit";
import {
  selectTableAction,
  updateTableColorAction,
  updateTablePositionAction,
} from "./reducer";
import type { IVector2 } from "@/contracts/math";

export interface IUIState {
  selectedTableId: string | null;
  tablePositions: Record<string, IVector2>;
  tableColors: Record<string, string>;
}

const initialState: IUIState = {
  selectedTableId: null,
  tablePositions: {},
  tableColors: {},
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectTable: selectTableAction,
    updateTablePosition: updateTablePositionAction,
    updateTableColor: updateTableColorAction,
  },
});

// Action creators are generated for each case reducer function
export const { selectTable, updateTablePosition, updateTableColor } =
  uiSlice.actions;
