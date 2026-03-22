import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateMySQL } from "@/lib/generate-mysql";
import { useTables } from "@/store/schema/selector";
import { IconBrandMysql, IconDatabaseExport } from "@tabler/icons-react";
import { saveAs } from "file-saver";

export const ExportSQL = () => {
  const tables = useTables();

  const onExportMySQL = () => {
    const sql = generateMySQL(tables);
    saveAs(new Blob([sql], { type: "text/sql" }), "schema.sql");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconDatabaseExport />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onExportMySQL}>
          <IconBrandMysql />
          MySQL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
