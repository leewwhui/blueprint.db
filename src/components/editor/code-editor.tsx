import Editor from "@monaco-editor/react";
import { type FC } from "react";

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: FC<CodeEditorProps> = (props) => {
  const { code } = props;

  return (
    <Editor
      className="border"
      height="100%"
      defaultLanguage="sql"
      value={code}
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
