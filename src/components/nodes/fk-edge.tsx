import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { FC } from "react";

export const FKEdge: FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return <BaseEdge id={id} path={edgePath} />;
};
