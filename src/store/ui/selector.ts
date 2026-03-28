import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useSelectedTable = () => {
  return useSelector((state: RootState) => {
    const selectedNodeId = state.ui.selectedTableId;
    if (!selectedNodeId) return null;

    return (
      state.schema.tables.find((table) => table.id === selectedNodeId) || null
    );
  });
};

export const useSelectedRelation = () => {
  return useSelector((state: RootState) => {
    const selectedRelationId = state.ui.selectedRelationId;
    if (!selectedRelationId) return null;

    return (
      state.schema.relations.find(
        (relation) => relation.id === selectedRelationId,
      ) || null
    );
  });
};

export const useTablePosition = () => {
  return useSelector((state: RootState) => {
    return state.ui.tablePositions;
  });
};
