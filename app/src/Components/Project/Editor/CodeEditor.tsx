import { useEffect, useRef, useState } from "react";
import { type Editor as CodemirrorEditorType } from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";

import type FileFromBackend from "../../../types/File";
import {
	codemirrorModesByExtension,
	languageNamesByExtension,
} from "./utils/languageModes";
import CodeEditorBottomPane from "./CodeEditorBottomPane";
import FilesTopPane from "./FilesTopPane";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";

interface CodeEditorProps {
	code: string;
	extension: string;
	onChange: (editor: any, data: any, value: string) => any;
	onSave: (editor: CodemirrorEditorType) => any;
	fileList: FileFromBackend[];
	activeFileId: string;
	onClickFileFromTopPane: (fileId: string) => any;
}

const CodeEditor = (props: CodeEditorProps) => {
	const editorRef = useRef<CodemirrorEditorType | null>(null);

	const [cursorPosition, setCursorPosition] = useState({ ch: 0, line: 0 });

	useEffect(() => {
		if (editorRef.current) editorRef.current.setSize("100%", "96.5%");
	}, []);

	const onCursorActivity = (editor: CodemirrorEditorType) =>
		setCursorPosition(editor.getCursor());

	return (
		<div className="h-full relative">
			<FilesTopPane
				files={props.fileList}
				activeFileId={props.activeFileId}
				onFileClick={props.onClickFileFromTopPane}
			/>
			<CodeMirror
				value={props.code || ""}
				onBeforeChange={props.onChange}
				onCursorActivity={onCursorActivity}
				editorDidMount={(editor) => (editorRef.current = editor)}
				className="code-editor h-[93.5%]"
				options={{
					mode: codemirrorModesByExtension[props.extension] || "",
					theme: "material",
					lineNumbers: true,
					indentUnit: 4,
					tabSize: 4,
					lineWrapping: true,
					extraKeys: {
						"Ctrl-S": props.onSave,
						"Cmd-S": props.onSave,
					},
				}}
			/>
			<CodeEditorBottomPane
				language={languageNamesByExtension[props.extension] || "Text"}
				lineNumber={cursorPosition.line + 1}
				colNumber={cursorPosition.ch + 1}
				className="absolute bottom-0 left-0 right-0"
			/>
		</div>
	);
};

export default CodeEditor;
