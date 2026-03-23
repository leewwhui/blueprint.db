import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "../ui/button";
import { IconSearch } from "@tabler/icons-react";
import { Kbd, KbdGroup } from "../ui/kbd";
import { useHotkeys } from "react-hotkeys-hook";

export const Search = () => {
  const [open, setOpen] = useState(false);
  useHotkeys("mod+k", () => setOpen(true), []);

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
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
