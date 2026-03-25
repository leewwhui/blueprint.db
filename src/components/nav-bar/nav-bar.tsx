import { Button } from "@/components/ui/button";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconGitFork,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ExportSQL } from "./export-sql";
import { ImportSQL } from "./import-sql";
import { Separator } from "../ui/separator";
import { useHistory } from "@/hooks/use-history";

export const Navbar = () => {
  const history = useHistory();

  return (
    <header className="h-(--nav-height) border-b shadow flex items-center px-10 justify-between w-full">
      <div className="flex gap-2">
        <ImportSQL />

        <ExportSQL />

        <Separator orientation="vertical" />

        <Button
          size="icon"
          variant="ghost"
          onClick={history.undo}
          disabled={!history.canUndo}
        >
          <IconArrowBackUp />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={history.redo}
          disabled={!history.canRedo}
        >
          <IconArrowForwardUp />
        </Button>

        <Separator orientation="vertical" />

        <Button size="icon" variant="ghost">
          <IconGitFork />
        </Button>
      </div>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
    </header>
  );
};
