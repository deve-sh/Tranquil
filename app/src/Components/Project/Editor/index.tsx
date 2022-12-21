import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
	disconnectProjectSocket,
	initializeProjectSocket,
	setupProjectEventListeners,
} from "../../../socket/projectSocketConnection";

import CodeEditor from "./CodeEditor";
import ProjectIframe from "./ProjectIframe";
import ProjectTerminalOutput from "./ProjectTerminalOutput";

const ProjectEditor = () => {
	const { projectId } = useParams();

	const [code, setCode] = useState(`function add(x, y){ return x + y; }`);
	const [projectAppInstanceURL, setProjectAppInstanceURL] = useState("");

	// Project Terminal Output
	const [showAppTerminal, setShowAppTerminal] = useState(false);
	const [appTerminalLogs, setAppTerminalLogs] = useState<string[]>([]);

	const toggleProjectTerminal = () => setShowAppTerminal((show) => !show);

	const onProjectSocketEvent = useCallback(
		(eventName: string, eventPayload: Record<string, any>) => {
			// Process and show logs to user.
			if (eventPayload.data && eventPayload.data.log)
				setAppTerminalLogs((logs) => [...logs, eventPayload.data.log]);
		},
		[projectId]
	);

	useEffect(() => {
		if (projectId) {
			// Initialize socket connection to project room.
			initializeProjectSocket(projectId);
			setupProjectEventListeners(onProjectSocketEvent);

			return () => {
				disconnectProjectSocket(projectId);
			};
		}
	}, [projectId]);

	return (
		<div className="project-editor flex w-full h-screen">
			<div className="project-editor-section sm:w-3/5 h-full bg-editor text-white flex flex-col">
				<CodeEditor code={code} onChange={(_, __, value) => setCode(value)} />
			</div>
			<div className="project-editor-section sm:w-2/5">
				<ProjectIframe
					src={projectAppInstanceURL}
					toggleTerminal={toggleProjectTerminal}
				/>
			</div>
			<ProjectTerminalOutput
				logs={appTerminalLogs}
				isOpen={showAppTerminal}
				toggle={toggleProjectTerminal}
			/>
		</div>
	);
};

export default ProjectEditor;
