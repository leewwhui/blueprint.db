import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { DatabaseDialect } from "@/contracts/database";
import type { IColumn, IRelation, ITable } from "@/contracts/schema";
import { ForeignKeyReferentialAction } from "@/contracts/relationship";

export abstract class DatabaseAdapter {
	public abstract readonly dialect: DatabaseDialect;
	protected abstract readonly typeMap: Record<ColumnType, string>;

	protected abstract quoteIdentifier(name: string): string;

	protected getAutoIncrementKeyword(): string | null {
		return null;
	}

	protected getReferentialActionSql(
		action: ForeignKeyReferentialAction | undefined,
		keyword: "UPDATE" | "DELETE",
	): string | null {
		if (!action) {
			return null;
		}

		return `ON ${keyword} ${action}`;
	}

	public getColumnType(columnType: ColumnType): string {
		return this.typeMap[columnType] ?? columnType;
	}

	public generateColumnSql(column: IColumn): string {
		const parts = [
			this.quoteIdentifier(column.name),
			this.getColumnType(column.type),
		];

		if (column.constraints[ColumnConstraints.NOT_NULL]) {
			parts.push("NOT NULL");
		}

		if (column.constraints[ColumnConstraints.UNIQUE]) {
			parts.push("UNIQUE");
		}

		const autoIncrementKeyword = this.getAutoIncrementKeyword();
		if (
			autoIncrementKeyword &&
			column.constraints[ColumnConstraints.AUTO_INCREMENT]
		) {
			parts.push(autoIncrementKeyword);
		}

		return `  ${parts.join(" ")}`;
	}

	public generatePrimaryKeySql(table: ITable): string | null {
		const primaryKeys = table.columns
			.filter((column) => column.constraints[ColumnConstraints.PRIMARY_KEY])
			.map((column) => this.quoteIdentifier(column.name));

		if (primaryKeys.length === 0) {
			return null;
		}

		return `  PRIMARY KEY (${primaryKeys.join(", ")})`;
	}

	public generateTableSql(table: ITable): string {
		const definitions = table.columns.map((column) => this.generateColumnSql(column));
		const primaryKeySql = this.generatePrimaryKeySql(table);

		if (primaryKeySql) {
			definitions.push(primaryKeySql);
		}

		return `CREATE TABLE ${this.quoteIdentifier(table.name)} (\n${definitions.join(",\n")}\n);`;
	}

	public generateRelationSql(
		relation: IRelation,
		tables: ITable[],
	): string | null {
		const sourceTable = tables.find((table) => table.id === relation.sourceTableId);
		const targetTable = tables.find((table) => table.id === relation.targetTableId);

		if (!sourceTable || !targetTable) {
			return null;
		}

		const sourceColumn = sourceTable.columns.find(
			(column) => column.id === relation.sourceColumnId,
		);
		const targetColumn = targetTable.columns.find(
			(column) => column.id === relation.targetColumnId,
		);

		if (!sourceColumn || !targetColumn) {
			return null;
		}

		const relationName = this.quoteIdentifier(
			`fk_${sourceTable.name}_${sourceColumn.name}_${targetTable.name}_${targetColumn.name}`,
		);

		const onDeleteSql = this.getReferentialActionSql(
			relation.onDelete,
			"DELETE",
		);
		const onUpdateSql = this.getReferentialActionSql(
			relation.onUpdate,
			"UPDATE",
		);

		return [
			`ALTER TABLE ${this.quoteIdentifier(sourceTable.name)}`,
			`ADD CONSTRAINT ${relationName}`,
			`FOREIGN KEY (${this.quoteIdentifier(sourceColumn.name)})`,
			`REFERENCES ${this.quoteIdentifier(targetTable.name)}(${this.quoteIdentifier(targetColumn.name)});`,
			onDeleteSql,
			onUpdateSql,
		]
			.filter((part): part is string => Boolean(part))
			.join(" ")
			.replace(
				`${this.quoteIdentifier(targetTable.name)}(${this.quoteIdentifier(targetColumn.name)});`,
				`${this.quoteIdentifier(targetTable.name)}(${this.quoteIdentifier(targetColumn.name)})`,
			) + ";";
	}

	public generateRelationsSql(tables: ITable[], relations: IRelation[]): string {
		return relations
			.map((relation) => this.generateRelationSql(relation, tables))
			.filter((statement): statement is string => Boolean(statement))
			.join("\n");
	}

	public generateSchemaSql(tables: ITable[], relations: IRelation[] = []): string {
		const tableSql = tables.map((table) => this.generateTableSql(table)).join("\n\n");
		const relationSql = this.generateRelationsSql(tables, relations);

		return [tableSql, relationSql].filter(Boolean).join("\n\n");
	}
}



