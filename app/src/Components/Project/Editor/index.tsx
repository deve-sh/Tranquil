import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import {
	getProjectFileContent,
	getProjectFileList,
	updateProjectFile,
} from "../../../API/Files";
import { initializeProjectRCE } from "../../../API/RCE";

import {
	disconnectProjectSocket,
	initializeProjectSocket,
	setupProjectEventListeners,
} from "../../../socket/projectSocketConnection";

import type FileFromBackend from "../../../types/File";
import createNestedFileStructure from "../../../utils/createNestedFileStructure";

import CodeEditor from "./CodeEditor";
import FileView from "./FileView";
import ProjectIframe from "./ProjectIframe";
import ProjectTerminalOutput from "./ProjectTerminalOutput";

import useExpandDirsForActiveFile from "./hooks/useExpandDirsForActiveFile";

const ProjectEditor = () => {
	const { projectId } = useParams();

	// Project Execution Iframe
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const [projectAppInstanceURL, setProjectAppInstanceURL] = useState("");

	const reloadIframe = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
	}, []);

	// File List and active file info
	const [fileList, setFileList] = useState<FileFromBackend[]>([]);
	const [nestedFileTree, setNestedFileTree] = useState<any[]>([]);
	const [activeFileId, setActiveFileId] = useState("");
	const [activeFile, setActiveFile] = useState<FileFromBackend | null>(null);
	const [code, setCode] = useState("");
	const [codeEditingDisabled, setCodeEditingDisabled] = useState(false);

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
				eventPayload.data.state === "project-instance-ready"
			)
				reloadIframe();

			if (
				eventPayload.data &&
				eventPayload.data.state === "project-instance-restarting"
			)
				setProjectAppInstanceURL("");
		},
		[projectId]
	);

	const getFileListAndSetLastUpdatedFile = useCallback(async () => {
		if (!projectId) return;

		const { data: response } = await getProjectFileList(projectId);
		if (!response.fileList) return;

		const fileList = response.fileList.map((file: FileFromBackend) => ({
			...file,
			path: file.path.replace(/[\\]/g, "/"),
		}));
		setFileList(fileList);
		createNestedFileStructure(fileList);

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
		setActiveFile(latestUpdatedFile);
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
				({ data: contents }) =>
					setCode(
						typeof contents === "string"
							? contents
							: JSON.stringify(contents, null, 4)
					)
			);
		} else setCode("");
	}, [activeFileId]);

	useEffect(() => {
		if (fileList.length) setNestedFileTree(createNestedFileStructure(fileList));
	}, [fileList]);

	useExpandDirsForActiveFile(activeFileId, fileList);

	const onFileClickFromViewer = (fileId: string) => {
		setActiveFile(
			fileList.find((file) => file._id === fileId) as FileFromBackend
		);
		setActiveFileId(fileId);
	};

	const onFileSave = async () => {
		if (!activeFileId || !activeFile || !projectId) return;

		const newContent = code;

		// Make API call to tell backend to update file.
		setCodeEditingDisabled(true);
		await updateProjectFile(projectId, {
			path: activeFile?.path,
			newContent,
			operation: "update",
		});
		setCodeEditingDisabled(false);
	};

	return (
		<div className="project-editor flex w-full h-screen">
			<div className="project-editor-section sm:w-1/5 bg-slate-700 h-full">
				<FileView
					tree={nestedFileTree}
					activeFileId={activeFileId}
					onFileClick={onFileClickFromViewer}
				/>
			</div>
			<div className="project-editor-section sm:w-2/5 h-full bg-editor text-white flex flex-col">
				<CodeEditor
					code={code}
					onChange={(_, __, value) =>
						projectAppInstanceURL && !setCodeEditingDisabled
							? setCode(value)
							: null
					}
					extension={activeFile?.path?.split(".").pop() || ""}
					onSave={onFileSave}
				/>
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
