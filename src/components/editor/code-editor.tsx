import type { DatabaseDialect } from "@/contracts/database";
import { useGenerateSQL } from "@/hooks/use-generate-sql";
import Editor from "@monaco-editor/react";
import { useMemo, type FC } from "react";

interface CodeEditorProps {
  dialect: DatabaseDialect;
}

export const CodeEditor: FC<CodeEditorProps> = (props) => {
  const { dialect } = props;
  const generateSql = useGenerateSQL();
  
  const code = useMemo(() => {
    return generateSql(dialect);
  }, [dialect]);

  return (
    <Editor
      height="100%"
      defaultLanguage="sql"
      value={code}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        readOnly: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        fontSize: 13,
        lineNumbersMinChars: 3,
      }}
    />
  );
};
