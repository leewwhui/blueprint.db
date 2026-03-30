import { createSlice } from "@reduxjs/toolkit";
import {
  selectRelationAction,
  selectTableAction,
  updateTablePositionAction,
} from "./reducer";
import type { IVector2 } from "@/contracts/math";

export interface IUIState {
  selected: {
    tableId: string | null;
    relationId: string | null;
  };
  tablePositions: Record<string, IVector2>;
}

const initialState: IUIState = {
  // selectedTableId: null,
  // selectedRelationId: null,
  selected: {
    tableId: null,
    relationId: null,
  },
  tablePositions: {},
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectTable: selectTableAction,
    selectRelation: selectRelationAction,
    updateTablePosition: updateTablePositionAction,
  },
});

// Action creators are generated for each case reducer function
export const { selectTable, updateTablePosition, selectRelation } =
  uiSlice.actions;
