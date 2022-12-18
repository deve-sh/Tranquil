import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";

interface EditorBaseProps {
	code: string;
	mode?: string;
	onChange: (editor: any, data: any, value: string) => any;
}

const EditorBase = (props: EditorBaseProps) => {
	return (
		<CodeMirror
			value={props.code || ""}
			onBeforeChange={props.onChange}
			className="code-editor"
			options={{
				mode: props.mode || "javascript",
				theme: "material",
				lineNumbers: true,
			}}
		/>
	);
};

export default EditorBase;
