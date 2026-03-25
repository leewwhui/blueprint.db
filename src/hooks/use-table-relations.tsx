import { useRelations } from "@/store/schema/selector";
import { useEdgesState, type Edge } from "@xyflow/react";
import { useEffect } from "react";

export const useTableRelations = () => {
  const relations = useRelations();
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const formattedEdges = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceTableId,
      sourceHandle: relation.sourceColumnId,
      target: relation.targetTableId,
      targetHandle: relation.targetColumnId,
      type: "fkEdge",
    }));

    setEdges(formattedEdges);
  }, [relations, setEdges]);

  return { edges, setEdges, onEdgesChange };
};
