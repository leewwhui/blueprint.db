import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableList } from "./table-list";

export const Sidebar = () => {
  return (
    <aside className="w-(--side-width) border-r shadow p-3 flex flex-col gap-3">
      <Tabs defaultValue="tables">
        <TabsList className="w-full">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>
        <TabsContent value="tables">
          <TableList />
        </TabsContent>
        <TabsContent value="relationships">
          Manage your relationships here.
        </TabsContent>
      </Tabs>
    </aside>
  );
};
