import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatabaseDialect } from "@/contracts/database";
import { useGenerateSQL } from "@/hooks/use-generate-sql";
import { IconBrandMysql, IconDatabaseExport } from "@tabler/icons-react";

export const ExportSQL = () => {
  const generateSql = useGenerateSQL();

  const onExportMySQL = () => {
    const sql = generateSql(DatabaseDialect.MYSQL);
    console.log(sql);
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
