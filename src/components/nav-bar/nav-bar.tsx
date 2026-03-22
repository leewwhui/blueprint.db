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

export const Navbar = () => {
  return (
    <header className="h-(--nav-height) border-b shadow flex items-center px-10 justify-between">
      <div className="flex gap-2">
        <NewTable />

        <Button variant="outline">
          <IconDatabaseImport />
          Import
        </Button>

        <ExportSQL />

        <Separator orientation="vertical"></Separator>

        <Button size="icon" variant="ghost">
          <IconArrowBackUp />
        </Button>

        <Button size="icon" variant="ghost">
          <IconArrowForwardUp />
        </Button>
      </div>

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
