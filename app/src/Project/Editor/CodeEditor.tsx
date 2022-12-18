import { useEffect, useRef } from "react";
import { type Editor as CodemirrorEditorType } from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";

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

	useEffect(() => {
		if (editorRef.current) editorRef.current.setSize("100%", "100%");
	}, []);

	return (
		<CodeMirror
			value={props.code || ""}
			onBeforeChange={props.onChange}
			onCursorActivity={console.log}
			editorDidMount={(editor) => (editorRef.current = editor)}
			className="code-editor h-full"
			options={{
				mode: props.mode || "javascript",
				theme: "material",
				lineNumbers: true,
				lineWrapping: true,
			}}
		/>
	);
};

export default CodeEditor;
