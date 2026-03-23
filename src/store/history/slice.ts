import { createSlice } from "@reduxjs/toolkit";
import { pushHistoryAction, undoAction } from "./reducer";

export type HistoryStack = {
  type: string;
  payload: any;
};

export interface IHistoryState {
  future: HistoryStack[];
  past: HistoryStack[];
}

const initialState: IHistoryState = {
  future: [],
  past: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    pushHistory: pushHistoryAction,
    undo: undoAction,
  },
});

// Action creators are generated for each case reducer function
export const { pushHistory, undo } = historySlice.actions;
