export enum ColumnType {
  INT = "int",
  BIGINT = "bigint",
  DECIMAL = "decimal",
  VARCHAR = "varchar",
  TEXT = "text",
  DATE = "date",
  DATETIME = "datetime",
  TIMESTAMP = "timestamp",
  BOOLEAN = "boolean",
  JSON = "json",
  UUID = "uuid",
}

export enum ColumnConstraints {
  PRIMARY_KEY = "PRIMARY_KEY",
  NOT_NULL = "NOT_NULL",
  UNIQUE = "UNIQUE",
  AUTO_INCREMENT = "AUTO_INCREMENT",
}