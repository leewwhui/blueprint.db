import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import {
  addTable,
  deleteRelations,
  deleteTable,
  updateRelation,
  updateTable,
} from "./slice";
import type { RootState } from "../store";
import toast from "react-hot-toast";

export const schemaListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: deleteTable,
    effect: async (action, listenerApi) => {
      const tableId = action.payload.tableId;
      const state = listenerApi.getState() as RootState;

      const relations = state.schema.relations.filter(
        (r) => r.sourceTableId === tableId || r.targetTableId === tableId,
      );

      listenerApi.dispatch(
        deleteRelations({ relationIds: relations.map((r) => r.id) }),
      );

      toast.success("Table deleted successfully");
    },
  });

  listener.startListening({
    actionCreator: updateTable,
    effect: async () => {
      toast.success("Table updated successfully");
    },
  });

  listener.startListening({
    actionCreator: addTable,
    effect: async () => {
      toast.success("Table added successfully");
    },
  });

  listener.startListening({
    actionCreator: updateRelation,
    effect: async () => {
      toast.success("Relationship updated successfully");
    },
  });
};
