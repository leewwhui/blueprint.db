import { Field, FieldLabel } from "@/components/ui/field";
import type { IColumn, IRelation, ITable } from "@/contracts/schema";
import { useTables } from "@/store/schema/selector";
import type { FC } from "react";

interface RelationshipHeaderProps {
  relation: IRelation;
}

export const RelationshipForm: FC<RelationshipHeaderProps> = (props) => {
  const { relation } = props;
  const tables = useTables();

  return (
    <div>
      <Field>
        <FieldLabel></FieldLabel>
      </Field>
    </div>
  );
};
