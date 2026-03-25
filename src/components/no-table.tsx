import { NewTable } from "./side-bar/new-table";

export const NoTable = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 absolute left-1/2 top-1/2 bg-transparent -translate-1/2">
      <h2 className="text-2xl font-bold">No tables yet</h2>
      <p className="text-gray-500">
        Start by adding a new table from the sidebar.
      </p>
      <NewTable />
    </div>
  );
};
