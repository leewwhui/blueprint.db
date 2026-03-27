import { ColumnConstraints } from "@/contracts/columns";
import {
  IconKey,
  IconNumber1Small,
  IconPlus,
  IconQuestionMark,
} from "@tabler/icons-react";

export const CONSTRAINT_NAMES: Record<ColumnConstraints, string> = {
  [ColumnConstraints.PRIMARY_KEY]: "Primary Key",
  [ColumnConstraints.NULLABLE]: "Nullable",
  [ColumnConstraints.UNIQUE]: "Unique",
  [ColumnConstraints.AUTO_INCREMENT]: "Auto Increment",
};

export const CONSTRAINT_ICONS: Record<ColumnConstraints, React.ElementType> = {
  [ColumnConstraints.PRIMARY_KEY]: IconKey,
  [ColumnConstraints.NULLABLE]: IconQuestionMark,
  [ColumnConstraints.UNIQUE]: IconNumber1Small,
  [ColumnConstraints.AUTO_INCREMENT]: IconPlus,
};
