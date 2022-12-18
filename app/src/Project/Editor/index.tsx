import { useState } from "react";

import CodeEditor from "./CodeEditor";
import ProjectIframe from "./ProjectIframe";
import CodeEditorBottomPane from "./CodeEditorBottomPane";

const ProjectEditor = () => {
	const [code, setCode] = useState(`function add(x, y){ return x + y; }`);
	const [projectAppInstanceURL, setProjectAppInstanceURL] = useState("");

	return (
		<div className="project-editor flex w-full h-screen">
			<div className="project-editor-section sm:w-3/5 h-full bg-editor text-white flex flex-col">
				<CodeEditor code={code} onChange={(_, __, value) => setCode(value)} />
				<CodeEditorBottomPane />
			</div>
			<div className="project-editor-section sm:w-2/5">
				<ProjectIframe src={projectAppInstanceURL} />
			</div>
		</div>
	);
};

export default ProjectEditor;
