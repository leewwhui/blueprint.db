import { generateMySQL } from "@/lib/generate-mysql";
import { parseSQL } from "@/lib/parse-sql";
import { useTables } from "@/store/schema/selector";
import MonacoEditor from "@monaco-editor/react";
import { useMemo } from "react";

export const CodeEditor = () => {
  const tables = useTables();

  const sql = useMemo(() => {
    return generateMySQL(tables);
  }, [tables]);

  const onSQLChange = (value: string | undefined) => {
    if (!value) return;
    parseSQL(value);
  }

  return <MonacoEditor defaultLanguage="sql" value={sql} onChange={onSQLChange} />;
};
