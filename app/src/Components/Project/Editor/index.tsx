import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { initializeProjectRCE } from "../../../API/RCE";

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
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const reloadIframe = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
	}, []);

	// Project Terminal Output
	const [showAppTerminal, setShowAppTerminal] = useState(false);
	const [appTerminalLogs, setAppTerminalLogs] = useState<string[]>([]);

	const toggleProjectTerminal = () => setShowAppTerminal((show) => !show);

	const onProjectSocketEvent = useCallback(
		(eventName: string, eventPayload: Record<string, any>) => {
			// Process instance up event
			if (
				eventPayload.step === "project-initialization-completed" &&
				eventPayload.publicURL
			)
				setProjectAppInstanceURL("http://" + eventPayload.publicURL + ":3000");

			// Process and show logs to user.
			if (eventPayload.data && eventPayload.data.log)
				setAppTerminalLogs((logs) => [...logs, eventPayload.data.log]);

			// Process project update steps
			if (eventPayload.step || eventPayload.message)
				setAppTerminalLogs((logs) => [
					...logs,
					eventPayload.step || eventPayload.message,
				]);

			if (
				eventPayload.data &&
				eventPayload.data.type === "project-instance-ready"
			)
				reloadIframe();
		},
		[projectId]
	);

	useEffect(() => {
		if (projectId) {
			// Initialize socket connection to project room.
			initializeProjectSocket(projectId);
			setupProjectEventListeners(onProjectSocketEvent);

			// Send an initialization API Call for the project.
			initializeProjectRCE(projectId).then(({ data: response }) => {
				if (response.publicURL) setProjectAppInstanceURL(response.publicURL);
			});

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
					projectId={projectId}
					src={projectAppInstanceURL}
					toggleTerminal={toggleProjectTerminal}
					onReady={(ref) => (iframeRef.current = ref)}
					reloadIframe={reloadIframe}
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
