import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { IconSearch } from "@tabler/icons-react";
import { Kbd, KbdGroup } from "../ui/kbd";
import { useHotkeys } from "react-hotkeys-hook";
import { useTables } from "@/store/schema/selector";
import { useDispatch } from "react-redux";
import { selectTable } from "@/store/ui/slice";

export const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const tables = useTables();
  const dispatch = useDispatch();

  useHotkeys("mod+k", () => setOpen(true), []);

  const matchedTables = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return tables;

    return tables.filter((table) => table.name.toLowerCase().includes(keyword));
  }, [searchTerm, tables]);

  const onSelectTable = (tableId: string) => {
    dispatch(selectTable(tableId));
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-52 flex justify-between"
      >
        <div className="flex items-center gap-2">
          <IconSearch></IconSearch>
          Search Table
        </div>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No results found for {searchTerm}</CommandEmpty>
            <CommandGroup heading="Tables">
              {matchedTables.map((table) => (
                <CommandItem
                  key={table.id}
                  onSelect={() => {
                    onSelectTable(table.id);
                  }}
                >
                  {table.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
