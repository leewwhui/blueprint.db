import type { IRelation } from "@/contracts/schema";
import type { FC } from "react";

interface RelationshipHeaderProps {
  relation: IRelation;
  name: string;
}

export const RelationshipHeader: FC<RelationshipHeaderProps> = (props) => {
  const { relation, name } = props;

  return (
    <div className="min-w-0">
      <p className="truncate text-sm">{name}</p>
    </div>
  );
};
