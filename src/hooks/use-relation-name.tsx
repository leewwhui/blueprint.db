import type { IRelation } from "@/contracts/schema";
import { getRelationShipName } from "@/lib/relation-name";
import { useTables } from "@/store/schema/selector";
import { useMemo } from "react";

export const useRelationShipName = (relation: IRelation) => {
  const tables = useTables();

  return useMemo(() => {
    return getRelationShipName(tables, relation);
  }, [relation, tables]);
};
