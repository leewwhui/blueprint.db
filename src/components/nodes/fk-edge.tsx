import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { Fragment, type FC } from "react";
import { ForeignKeyCardinality } from "@/contracts/relationship";

function EdgeLabel({ transform, label }: { transform: string; label: string }) {
  return (
    <div
      style={{
        transform,
      }}
      className="nodrag nopan absolute"
    >
      {label}
    </div>
  );
}

function getCardinalityLabels(cardinality: ForeignKeyCardinality | unknown): [string, string] {
  switch (cardinality) {
    case ForeignKeyCardinality.ONE_TO_ONE:  return ["1", "1"];
    case ForeignKeyCardinality.ONE_TO_MANY: return ["1", "N"];
    case ForeignKeyCardinality.MANY_TO_ONE: return ["N", "1"];
    case ForeignKeyCardinality.MANY_TO_MANY: return ["N", "N"];
    default: return ["1", "1"];
  }
}

export const FKEdge: FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [sourceLabel, targetLabel] = getCardinalityLabels(data?.cardinality);

  return (
    <Fragment>
      <BaseEdge id={id} path={edgePath} />;
      <EdgeLabelRenderer>
        <EdgeLabel
          transform={`translate(-50%, -50%) translate(${sourceX + 10}px,${sourceY}px)`}
          label={sourceLabel}
        />
        <EdgeLabel
          transform={`translate(-50%, -50%) translate(${targetX - 10}px,${targetY}px)`}
          label={targetLabel}
        />
      </EdgeLabelRenderer>
    </Fragment>
  );
};
