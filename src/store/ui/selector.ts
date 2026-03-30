import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useSelected = () => {
  return useSelector((state: RootState) => {
    return state.ui.selected;
  });
};

export const useSelectedTable = () => {
  return useSelector((state: RootState) => {
    const selectedNodeId = state.ui.selected.tableId;
    if (!selectedNodeId) return null;

    return (
      state.schema.tables.find((table) => table.id === selectedNodeId) || null
    );
  });
};

export const useSelectedRelation = () => {
  return useSelector((state: RootState) => {
    const selectedRelationId = state.ui.selected.relationId;
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
