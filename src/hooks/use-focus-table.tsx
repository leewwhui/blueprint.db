import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useFocusTable = () => {
	const { setCenter, getNode } = useReactFlow();

	const focusTable = useCallback(
		(tableId: string) => {
			const node = getNode(tableId);

			if (!node) return;

			const width = node.measured?.width || node.width || 0;
			const height = node.measured?.height || node.height || 0;
			const x = node.position.x + width / 2;
			const y = node.position.y + height / 2;

			setCenter(x, y, { duration: 500, zoom: 1 });
		},
		[getNode, setCenter],
	);

	return { focusTable };
};
