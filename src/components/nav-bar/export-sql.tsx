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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconBrandMysql, IconDatabaseExport } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { DatabaseDialect } from "@/contracts/database";
import { CodeEditor } from "../editor/code-editor";
import { useGenerateSQL } from "@/hooks/use-generate-sql";

export const ExportSQL = () => {
  const [open, setOpen] = useState(false);
  const [dialect, setDialect] = useState<DatabaseDialect | null>(null);
  const generateSql = useGenerateSQL();

  const code = useMemo(() => {
    if (!dialect) return null;
    return generateSql(dialect);
  }, [dialect]);

  const downloadSql = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `schema-${dialect}.sql`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDatabaseExport />
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

          <div className="overflow-hidden rounded">
            {code && <CodeEditor code={code} />}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={downloadSql}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
