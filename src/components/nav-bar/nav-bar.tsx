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
import { useDispatch } from "react-redux";
import { undo } from "@/store/history/slice";
import { Search } from "./search";

export const Navbar = () => {
  const dispatch = useDispatch();

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

        <Button size="icon" variant="ghost" onClick={() => dispatch(undo())}>
          <IconArrowBackUp />
        </Button>

        <Button size="icon" variant="ghost">
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
