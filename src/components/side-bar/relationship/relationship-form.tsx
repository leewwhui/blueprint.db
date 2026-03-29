import { Field, FieldLabel } from "@/components/ui/field";
import type { IRelation } from "@/contracts/schema";
import { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
  type RelationshipFormValues,
} from "@/contracts/relationship";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateRelation } from "@/store/schema/slice";

interface RelationshipFormProps {
  relation: IRelation;
}

export const RelationshipForm: FC<RelationshipFormProps> = ({ relation }) => {
  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm<RelationshipFormValues>({
    defaultValues: {
      cardinality: relation.cardinality,
      onUpdate: relation.onUpdate,
      onDelete: relation.onDelete,
    },
  });

  const onSubmit = (values: RelationshipFormValues) => {
    dispatch(updateRelation({ ...relation, ...values }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Field>
        <FieldLabel className="font-bold text-xs">Cardinality</FieldLabel>
        <Controller
          control={control}
          name="cardinality"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ForeignKeyCardinality).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div className="flex gap-3">
        <Field>
          <FieldLabel className="font-bold text-xs">On Update</FieldLabel>
          <Controller
            control={control}
            name="onUpdate"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ForeignKeyReferentialAction).map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel className="font-bold text-xs">On Delete</FieldLabel>
          <Controller
            control={control}
            name="onDelete"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ForeignKeyReferentialAction).map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      <Button variant="outline" type="submit">
        Save
      </Button>
    </form>
  );
};
