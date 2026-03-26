import type { FC } from "react";

interface RelationshipHeaderProps {
  name: string;
}

export const RelationshipHeader: FC<RelationshipHeaderProps> = (props) => {
  const { name } = props;

  return (
    <div className="min-w-0">
      <p className="truncate text-sm">{name}</p>
    </div>
  );
};
