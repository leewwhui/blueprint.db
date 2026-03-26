import type { FC } from "react";

interface EdgeLabelProps {
  transform: string;
  label: string;
}

export const EdgeLabel: FC<EdgeLabelProps> = (props) => {
  const { transform, label } = props;

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
};
