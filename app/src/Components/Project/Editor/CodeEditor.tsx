import { useEffect, useRef, useState } from "react";
import { type Editor as CodemirrorEditorType } from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";

import CodeEditorBottomPane from "./CodeEditorBottomPane";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

interface CodeEditorProps {
	code: string;
	mode?: string;
	onChange: (editor: any, data: any, value: string) => any;
	onCursorPositionChange?: (position: { line: number; column: number }) => any;
}

const CodeEditor = (props: CodeEditorProps) => {
	const editorRef = useRef<CodemirrorEditorType | null>(null);

	const [cursorPosition, setCursorPosition] = useState({ ch: 0, line: 0 });

	useEffect(() => {
		if (editorRef.current) editorRef.current.setSize("100%", "100%");
	}, []);

	const onCursorActivity = (editor: CodemirrorEditorType) =>
		setCursorPosition(editor.getCursor());

	return (
		<>
			<CodeMirror
				value={props.code || ""}
				onBeforeChange={props.onChange}
				onCursorActivity={onCursorActivity}
				editorDidMount={(editor) => (editorRef.current = editor)}
				className="code-editor h-full"
				options={{
					mode: props.mode || "javascript",
					theme: "material",
					lineNumbers: true,
					indentUnit: 4,
					tabSize: 4,
					lineWrapping: true,
				}}
			/>
			<CodeEditorBottomPane
				language={props.mode || "javascript"}
				lineNumber={cursorPosition.line + 1}
				colNumber={cursorPosition.ch + 1}
			/>
		</>
	);
};

export default CodeEditor;
