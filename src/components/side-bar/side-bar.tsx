import { IconGitFork, IconLine, IconTable } from "@tabler/icons-react";
import { TableList } from "./table/table-list";
import { ToolbarButton } from "./tool-bar-button";
import { useEffect, useState } from "react";
import { RelationshipList } from "./relationship/relationships";
import { useSelected } from "@/store/ui/selector";

export const Sidebar = () => {
  const [tool, setTool] = useState<"tables" | "refs" | "versions">("tables");
  const selected = useSelected();

  useEffect(() => {
    if (selected.tableId) {
      setTool("tables");
    } else if (selected.relationId) {
      setTool("refs");
    }
  }, [selected]);

  return (
    <aside className="border-r shadow flex text-sm h-full min-h-0 overflow-hidden">
      <div className="w-20 shrink-0 flex flex-col bg-muted items-center p-3 gap-1">
        <ToolbarButton
          active={tool === "tables"}
          onClick={() => setTool("tables")}
        >
          <IconTable size={16}></IconTable>
          <p className="text-xs">Tables</p>
        </ToolbarButton>

        <ToolbarButton active={tool === "refs"} onClick={() => setTool("refs")}>
          <IconLine size={16}></IconLine>
          <p className="text-xs">Refs</p>
        </ToolbarButton>

        <ToolbarButton
          active={tool === "versions"}
          onClick={() => setTool("versions")}
        >
          <IconGitFork size={16}></IconGitFork>
          <p className="text-xs">Version</p>
        </ToolbarButton>
      </div>
      <div className="w-(--side-width) h-full min-h-0 overflow-y-auto overflow-x-hidden">
        {tool === "tables" && <TableList />}
        {tool === "refs" && <RelationshipList />}
      </div>
    </aside>
  );
};
