import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { addTable, deleteTable } from "./slice";
import { toast } from "sonner";
import { updateTableColor, updateTablePosition } from "../ui/slice";
import { DefaultTableTheme } from "@/lib/colors";

export const schemaListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: deleteTable,
    effect: async () => {
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
