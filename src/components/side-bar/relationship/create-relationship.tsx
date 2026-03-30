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
import { nanoid } from "nanoid";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";
import { useRelationValidate } from "@/hooks/use-relation-validation";
import toast from "react-hot-toast";
import { useHistory } from "@/hooks/use-history";
import { CreateRelationCommand } from "@/commands/CreateRelationCommand";

export const CreateRelationship = () => {
  const tables = useTables();
  const history = useHistory();
  const validateRelation = useRelationValidate();
  const [open, setOpen] = useState(false);
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

  const onSave = () => {
    if (!primaryTableId || !primaryColumnId || !foreignTableId || !foreignColumnId) return;

    const validation = validateRelation(
      foreignTableId,
      foreignColumnId,
      primaryTableId,
      primaryColumnId,
    );

    if (!validation.valid) {
      return toast.error(validation.message);
    }

    history.executeCommand(
      new CreateRelationCommand({
        id: nanoid(),
        sourceTableId: foreignTableId,
        sourceColumnId: foreignColumnId,
        targetTableId: primaryTableId,
        targetColumnId: primaryColumnId,
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      }),
    );

    setOpen(false);
    setPrimaryTableId(null);
    setPrimaryColumnId(null);
    setForeignTableId(null);
    setForeignColumnId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button disabled={!primaryColumnId || !foreignColumnId} onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
