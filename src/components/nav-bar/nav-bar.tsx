import { Button } from "@/components/ui/button";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDatabaseImport,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ExportSQL } from "./export-sql";
import { Separator } from "../ui/separator";
import { NewTable } from "../new-table";
import { Search } from "./search";
import { useHistory } from "@/hooks/use-history";

export const Navbar = () => {
  const history = useHistory();

  return (
    <header className="h-(--nav-height) border-b shadow flex items-center px-10 justify-between w-full">
      <div className="flex gap-2">
        <NewTable />

        <Button variant="outline">
          <IconDatabaseImport />
          Import
        </Button>

        <ExportSQL />

        <Separator orientation="vertical"></Separator>

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
      </div>

      <Search />

      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </div>
    </header>
  );
};
