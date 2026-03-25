import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateMySQL } from "@/lib/generate-mysql";
import { useRelations, useTables } from "@/store/schema/selector";
import { IconBrandMysql, IconDatabaseExport } from "@tabler/icons-react";

export const ExportSQL = () => {
  const tables = useTables();
  const relations = useRelations();

  const onExportMySQL = () => {};

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
