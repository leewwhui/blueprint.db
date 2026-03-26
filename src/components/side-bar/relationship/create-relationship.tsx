import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { useTables } from "@/store/schema/selector";
import { IconLine } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const CreateRelationship = () => {
  const tables = useTables();
  const [primaryTableId, setPrimaryTableId] = useState<string | null>(null);
  const [primaryColumnId, setPrimaryColumnId] = useState<string | null>(null);
  const [foreignTableId, setForeignTableId] = useState<string | null>(null);
  const [foreignColumnId, setForeignColumnId] = useState<string | null>(null);

  const primaryTable = tables.find((t) => t.id === primaryTableId);
  const foreignTable = tables.find((t) => t.id === foreignTableId);

  const onChangePrimaryTable = (tableId: string) => {
    setPrimaryTableId(tableId);
    setPrimaryColumnId(null);
  };

  const onChangeForeignTable = (tableId: string) => {
    setForeignTableId(tableId);
    setForeignColumnId(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <IconLine />
          Create Relationship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Relationship</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-1">
            <Field>
              <FieldLabel className="text-sm font-bold">
                Primary Table
              </FieldLabel>
              <Select
                value={primaryTableId || ""}
                onValueChange={onChangePrimaryTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem value={table.id} key={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-sm font-bold">
                Primary Column
              </FieldLabel>
              <Select
                value={primaryColumnId || ""}
                onValueChange={setPrimaryColumnId}
                disabled={!primaryTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {primaryTable?.columns.map((col) => (
                    <SelectItem value={col.id} key={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex gap-1">
            <Field>
              <FieldLabel className="text-sm font-bold">
                Foreign Table
              </FieldLabel>
              <Select
                value={foreignTableId || ""}
                onValueChange={onChangeForeignTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem value={table.id} key={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-sm font-bold">
                Foreign Column
              </FieldLabel>
              <Select
                value={foreignColumnId || ""}
                onValueChange={setForeignColumnId}
                disabled={!foreignTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {foreignTable?.columns.map((col) => (
                    <SelectItem value={col.id} key={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!primaryColumnId || !foreignColumnId}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
