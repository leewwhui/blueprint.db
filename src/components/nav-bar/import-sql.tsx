import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { IconDatabaseImport } from "@tabler/icons-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { importSchema } from "@/store/schema/slice";
import { parseSqlToSchema } from "@/lib/parse-sql";
import toast from "react-hot-toast";

export const ImportSQL = () => {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [sql, setSql] = useState("");

	const onImport = () => {
		try {
			const parsed = parseSqlToSchema(sql);
			dispatch(importSchema(parsed));
			toast.success("SQL imported successfully");
			setOpen(false);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to import SQL";
			toast.error(message);
		}
	};

	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>
				<IconDatabaseImport />
				Import
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[70vh]">
					<DialogHeader>
						<DialogTitle>Import SQL</DialogTitle>
					</DialogHeader>

					<Editor
						height="100%"
						defaultLanguage="sql"
						value={sql}
						onChange={(value) => setSql(value ?? "")}
						theme="vs-dark"
						options={{
							minimap: { enabled: false },
							scrollBeyondLastLine: false,
							wordWrap: "on",
							fontSize: 13,
							lineNumbersMinChars: 3,
						}}
					/>

					<div className="flex justify-end">
						<Button onClick={onImport}>Import</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
