import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import type { FC } from "react";

interface RelationshipHeaderProps {
  name: string;
  onDelete: (event: React.MouseEvent) => void;
}

export const RelationshipHeader: FC<RelationshipHeaderProps> = (props) => {
  const { name, onDelete } = props;

  return (
    <div className="group flex items-center justify-between gap-2 w-full min-w-0">
      <p className="truncate text-sm">{name}</p>
      <Button
        size="icon-sm"
        variant="ghost"
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100"
        onClick={onDelete}
      >
        <IconTrash />
      </Button>
    </div>
  );
};
