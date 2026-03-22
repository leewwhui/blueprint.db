import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useTables = () => {
  return useSelector((state: RootState) => state.schema.tables);
};

export const useRelations = () => {
  return useSelector((state: RootState) => state.schema.relations);
};
