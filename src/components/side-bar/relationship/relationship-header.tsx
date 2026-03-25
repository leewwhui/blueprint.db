import type { IRelation } from "@/contracts/schema";
import type { FC } from "react";

interface RelationshipHeaderProps {
  relation: IRelation;
}

export const RelationshipHeader: FC<RelationshipHeaderProps> = (props) => {
  const { relation } = props;

  return (
    <div className="min-w-0">
      <p className="truncate text-sm">{relation.name}</p>
    </div>
  );
};
