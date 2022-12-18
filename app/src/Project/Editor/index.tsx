import { useState } from "react";

import CodeEditor from "./CodeEditor";
import ProjectIframe from "./ProjectIframe";
import ProjectTerminalOutput from "./ProjectTerminalOutput";

const ProjectEditor = () => {
	const [code, setCode] = useState(`function add(x, y){ return x + y; }`);
	const [projectAppInstanceURL, setProjectAppInstanceURL] = useState("");

	// Project Terminal Output
	const [showAppTerminal, setShowAppTerminal] = useState(false);
	const [appTerminalLogs, setAppTerminalLogs] = useState([
		"> npm run start",
		"Installing dependencies",
		"> npm run start",
		"Installing dependencies",
		"> npm run start",
		"Installing dependencies",
		"> npm run start",
		"Installing dependencies",
		"> npm run start",
	]);

	return (
		<div className="project-editor flex w-full h-screen">
			<div className="project-editor-section sm:w-3/5 h-full bg-editor text-white flex flex-col">
				<CodeEditor code={code} onChange={(_, __, value) => setCode(value)} />
			</div>
			<div className="project-editor-section sm:w-2/5">
				<ProjectIframe src={projectAppInstanceURL} />
			</div>
			<ProjectTerminalOutput
				logs={appTerminalLogs}
				isOpen={showAppTerminal}
				toggle={() => setShowAppTerminal((show) => !show)}
			/>
		</div>
	);
};

export default ProjectEditor;
