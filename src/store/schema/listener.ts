import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { deleteTable } from "./slice";
import { toast } from "sonner";

export const schemaListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: deleteTable,

    effect: async () => {
      toast.success("Table deleted successfully", { position: "top-center" });
    },
  });
};
