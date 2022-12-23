import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProjectFileContent, getProjectFileList } from "../../../API/Files";
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

	// Project Execution Iframe
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const [projectAppInstanceURL, setProjectAppInstanceURL] = useState("");

	const reloadIframe = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
	}, []);

	// File List and active file info
	const [fileList, setFileList] = useState([]);
	const [activeFileId, setActiveFileId] = useState("");
	const [code, setCode] = useState("");

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

	const getFileListAndSetLastUpdatedFile = useCallback(async () => {
		if (!projectId) return;

		const { data: response } = await getProjectFileList(projectId);
		if (!response.fileList) return;

		const fileList = response.fileList;
		setFileList(fileList);

		// Find the last updated file from the list and set that as the active file.
		let latestUpdatedFile = null;
		for (const fileEntry of fileList) {
			if (latestUpdatedFile === null) {
				latestUpdatedFile = fileEntry;
				continue;
			}
			if (new Date(fileEntry.updatedAt) > new Date(latestUpdatedFile.updatedAt))
				latestUpdatedFile = fileEntry;
		}
		setActiveFileId(latestUpdatedFile._id);
	}, [projectId]);

	useEffect(() => {
		if (projectId) {
			// Initialize socket connection to project room.
			initializeProjectSocket(projectId);
			setupProjectEventListeners(onProjectSocketEvent);

			// Send an initialization API Call for the project.
			// initializeProjectRCE(projectId).then(({ data: response }) => {
			// 	if (response.publicURL) setProjectAppInstanceURL(response.publicURL);
			// });

			getFileListAndSetLastUpdatedFile();

			return () => {
				disconnectProjectSocket(projectId);
			};
		}
	}, [projectId]);

	useEffect(() => {
		if (activeFileId && projectId) {
			getProjectFileContent(projectId, activeFileId).then(
				({ data: contents }) => setCode(contents)
			);
		} else setCode("");
	}, [activeFileId]);

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
