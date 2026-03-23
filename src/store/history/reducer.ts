import type { PayloadAction } from "@reduxjs/toolkit";
import type { IHistoryState } from "./slice";

export const pushHistoryAction = (
  state: IHistoryState,
  action: PayloadAction<{
    type: string;
    future: any;
    past: any;
  }>,
) => {
  const { future, past, type } = action.payload;
  state.future.push({ payload: future, type });
  state.past.push({ payload: past, type });
};

export const undoAction = (state: IHistoryState) => {
  if (state.past.length === 0) return;

  const lastAction = state.past.pop();

  if (lastAction) {
    state.future.push(lastAction);
  }
};
