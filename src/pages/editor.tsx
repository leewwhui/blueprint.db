import { Sidebar } from "@/components/side-bar/side-bar";
import { Navbar } from "@/components/nav-bar/nav-bar";
import { SchemaEditor } from "@/components/schema-editor";
import { ReactFlowProvider } from "@xyflow/react";

export const Editor = () => {
  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen flex flex-col">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />
          <SchemaEditor />
        </div>
      </div>
    </ReactFlowProvider>
  );
};
