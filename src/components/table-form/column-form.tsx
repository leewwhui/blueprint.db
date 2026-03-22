import { IconSelector, IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import type { FC } from "react";
import { Field } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FieldType } from "@/lib/field-type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { IColumn } from "@/contracts/schema";

interface ColumnFormProps {
  column: IColumn;
  onColumnDelete: (columnId: string) => void;
  onColumnChange: (column: IColumn) => void;
}

export const ColumnForm: FC<ColumnFormProps> = (props) => {
  const { column, onColumnChange, onColumnDelete } = props;

  return (
    <Collapsible key={column.id}>
      <div className="flex items-center gap-1">
        <Input
          type="text"
          placeholder="Enter column name"
          value={column.name}
          onChange={(e) => onColumnChange({ ...column, name: e.target.value })}
        />
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onColumnDelete(column.id)}
        >
          <IconX />
        </Button>

        <CollapsibleTrigger asChild>
          <Button size="icon" variant="ghost">
            <IconSelector />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="border-b p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-3">
            <span>Type</span>

            <Select
              value={column.type}
              onValueChange={(value: FieldType) =>
                onColumnChange({ ...column, type: value })
              }
            >
              <SelectTrigger className="flex-1" size="sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(FieldType).map((fieldType) => (
                    <SelectItem key={fieldType} value={fieldType}>
                      {fieldType}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Field orientation="horizontal">
            <Checkbox
              id="primary-key"
              checked={column.isPrimary}
              onCheckedChange={(val: boolean) =>
                onColumnChange({ ...column, isPrimary: val })
              }
            />
            <Label htmlFor="primary-key">Primary Key</Label>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="nullable"
              checked={column.isNullable}
              onCheckedChange={(val: boolean) =>
                onColumnChange({ ...column, isNullable: val })
              }
            />
            <Label htmlFor="nullable">Nullable</Label>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="unique"
              checked={column.isUnique}
              onCheckedChange={(val: boolean) =>
                onColumnChange({ ...column, isUnique: val })
              }
            />
            <Label htmlFor="unique">Unique</Label>
          </Field>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
