import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconBrandMysql, IconDatabaseExport } from "@tabler/icons-react";
import { useState } from "react";
import { DatabaseDialect } from "@/contracts/database";
import { CodeEditor } from "../editor/code-editor";

export const ExportSQL = () => {
  const [open, setOpen] = useState(false);
  const [dialect, setDialect] = useState<DatabaseDialect | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <IconDatabaseExport />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialect(DatabaseDialect.MYSQL);
            }}
          >
            <IconBrandMysql />
            MySQL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[70vh]">
          <DialogHeader>
            <DialogTitle>SQL Preview</DialogTitle>
          </DialogHeader>
          {dialect && <CodeEditor dialect={dialect} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
