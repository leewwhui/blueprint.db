import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { addTable, deleteRelations, deleteTable } from "./slice";
import { toast } from "sonner";
import { updateTableColor, updateTablePosition } from "../ui/slice";
import { DefaultTableTheme } from "@/lib/colors";
import type { RootState } from "../store";

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

      toast.success("Table deleted successfully", { position: "top-center" });
    },
  });

  listener.startListening({
    actionCreator: addTable,
    effect: async (action, listenerApi) => {
      toast.success("Table added successfully", { position: "top-center" });
      const tableId = action.payload.id;

      listenerApi.dispatch(
        updateTablePosition({
          tableId,
          position: { x: 0, y: 0 },
        }),
      );

      listenerApi.dispatch(
        updateTableColor({
          tableId,
          color: DefaultTableTheme,
        }),
      );
    },
  });
};
