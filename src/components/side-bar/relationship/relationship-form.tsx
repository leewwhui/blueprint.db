import { Field, FieldLabel } from "@/components/ui/field";
import type { IRelation } from "@/contracts/schema";
import { useTables } from "@/store/schema/selector";
import type { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";
import { Button } from "@/components/ui/button";

interface RelationshipHeaderProps {
  relation: IRelation;
}

export const RelationshipForm: FC<RelationshipHeaderProps> = (props) => {
  const { relation } = props;

  return (
    <div className="p-2 flex flex-col gap-3">
      <Field>
        <FieldLabel className="font-bold text-xs">Cardinality</FieldLabel>
        <Select defaultValue={relation.cardinality}>
          <SelectTrigger>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ForeignKeyCardinality).map((cardinality) => (
              <SelectItem key={cardinality} value={cardinality}>
                {cardinality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="flex gap-3">
        <Field>
          <FieldLabel className="font-bold text-xs">On Update</FieldLabel>
          <Select defaultValue={relation.onUpdate}>
            <SelectTrigger>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ForeignKeyReferentialAction).map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel className="font-bold text-xs">On Delete</FieldLabel>
          <Select defaultValue={relation.onDelete}>
            <SelectTrigger>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ForeignKeyReferentialAction).map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Button variant="outline" type="submit">
        Save
      </Button>
    </div>
  );
};
