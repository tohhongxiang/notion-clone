"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";

interface EditorProps {
	onChange: (value: string) => void;
	initialContent?: string;
	editable?: boolean;
}

export default function Editor({
	onChange,
	initialContent,
	editable,
}: EditorProps) {
	const { resolvedTheme } = useTheme();
	const { edgestore } = useEdgeStore();

	const handleUpload = async (file: File) => {
		const response = await edgestore.publicFiles.upload({ file });
		return response.url;
	};

	const editor: BlockNoteEditor = useCreateBlockNote({
		initialContent: initialContent
			? (JSON.parse(initialContent) as Block[])
			: undefined,
		uploadFile: handleUpload,
	});
	return (
		<div>
			<BlockNoteView
				editor={editor}
				theme={resolvedTheme === "dark" ? "dark" : "light"}
				editable={editable}
				onChange={() =>
					onChange(JSON.stringify(editor.document, null, 2))
				}
			/>
		</div>
	);
}
