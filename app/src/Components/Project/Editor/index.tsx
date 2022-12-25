import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import {
	createProjectFile,
	getProjectFileContent,
	getProjectFileList,
	updateProjectFile,
} from "../../../API/Files";
import { restartProjectAppServer } from "../../../API/Projects";
import { initializeProjectRCE } from "../../../API/RCE";

import {
	disconnectProjectSocket,
	initializeProjectSocket,
	setupProjectEventListeners,
} from "../../../socket/projectSocketConnection";

import type FileFromBackend from "../../../types/File";
import createNestedFileStructure from "../../../utils/createNestedFileStructure";
import useToast from "../../../hooks/useToast";

import CodeEditor from "./CodeEditor";
import FileView from "./FileView";
import ProjectIframe from "./ProjectIframe";
import ProjectTerminalOutput from "./ProjectTerminalOutput";
import NewFileModal from "./NewFileModal";
import HiddenFileUploadInput from "./HiddenFileUploadInput";

import useExpandDirsForActiveFile from "./hooks/useExpandDirsForActiveFile";
import isDeletionProtectedFile from "./utils/deletionProtectedFiles";
import BinaryContent from "./BinaryContent";

const ProjectEditor = () => {
	const { projectId } = useParams();

	const toast = useToast();

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
			setCode("");
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
		await updateProjectFile(projectId, activeFileId, {
			path: activeFile?.path,
			newContent,
			operation: "update",
		});
		setCodeEditingDisabled(false);

		// If the file updated is package.json, that means app name has changed or dependencies have changed.
		// Send a restart signal to the server.
		if (activeFile.path.includes("package.json"))
			restartProjectAppServer(projectId);
	};

	// Existing File deletion mode
	const deleteFile = async (fileId: string) => {
		if (!projectId) return;

		const file = fileList.find((file) => file._id === fileId);
		if (!file) return;

		if (isDeletionProtectedFile(file.path))
			return toast({
				message: "Protected file. Cannot be deleted.",
				type: "error",
			});

		if (!window.confirm("Are you sure? This is an irreversible action."))
			return;

		setCodeEditingDisabled(true);
		const { error } = await updateProjectFile(projectId, fileId, {
			path: file.path,
			newContent: "",
			operation: "delete",
		});
		if (error) return toast({ type: "error", message: error.message });
		// Refresh file list
		await getFileListAndSetLastUpdatedFile();
		setCodeEditingDisabled(false);
	};

	// File Creation Mode
	const [directoryToCreateNewFileIn, setDirectoryToCreateNewFileIn] =
		useState("");
	const [newFileName, setNewFileName] = useState("");
	const [showNewFileModal, setShowNewFileModal] = useState(false);

	const createNewFile = async (
		directory: string,
		fileName: string,
		contents: string = "",
		isReadableContent: boolean = true
	) => {
		if (!projectId) return {};
		setCodeEditingDisabled(true);
		const { error } = await createProjectFile(projectId, {
			path: directory + (directory ? "/" : "") + fileName,
			contents,
			isReadableContent,
		});
		if (error) {
			toast({ type: "error", message: error.message });
			return { error };
		}
		// Refetch updated file list
		await getFileListAndSetLastUpdatedFile();
		setCodeEditingDisabled(false);
		return {};
	};

	const onClickFileCreateInFileViewer = (dirName: string) => {
		setNewFileName("");
		setDirectoryToCreateNewFileIn(dirName);
		setShowNewFileModal(true);
	};
	const closeNewFileModal = () => {
		setDirectoryToCreateNewFileIn("");
		setNewFileName("");
		setShowNewFileModal(false);
	};

	const onClickFileCreate = async () => {
		const { error } = await createNewFile(
			directoryToCreateNewFileIn,
			newFileName
		);
		if (!error) closeNewFileModal();
	};

	// File Upload mode
	const fileUploadInputRef = useRef<HTMLInputElement | null>(null);
	const [directoryToUploadFileTo, setDirectoryToUploadFileTo] = useState("");
	const onClickFileUpload = (dirName: string) => {
		setDirectoryToUploadFileTo(dirName);
		// Invoke File Upload input
		if (fileUploadInputRef.current) fileUploadInputRef.current.click();
	};
	const onFileToUploadChange = async (file?: File, rawContents?: string) => {
		if (
			!directoryToUploadFileTo ||
			!projectId ||
			!file ||
			!rawContents ||
			!fileUploadInputRef.current
		)
			return;

		const isReadableContent =
			file.type.startsWith("text/") ||
			file.type.includes("/json") ||
			file.type === "" ||
			["ts", "tsx"].includes(file.name.split(".").pop() as string);

		const { error } = await createNewFile(
			directoryToUploadFileTo,
			file.name,
			rawContents,
			isReadableContent
		);

		if (!error) fileUploadInputRef.current.value = ""; // Reset input value of file upload
	};

	return (
		<div className="project-editor flex w-full h-screen">
			<div className="project-editor-section sm:w-1/5 bg-slate-700 h-full">
				<FileView
					tree={nestedFileTree}
					activeFileId={activeFileId}
					onFileClick={onFileClickFromViewer}
					onClickFileCreate={onClickFileCreateInFileViewer}
					onClickFileDelete={deleteFile}
					onClickFileUpload={onClickFileUpload}
				/>
			</div>
			<div className="project-editor-section sm:w-2/5 h-full bg-editor text-white flex flex-col">
				{activeFile?.isReadableContent === false ? (
					<BinaryContent />
				) : (
					<CodeEditor
						code={code}
						onChange={(_, __, value) =>
							projectAppInstanceURL && !codeEditingDisabled
								? setCode(value)
								: null
						}
						extension={activeFile?.path?.split(".").pop() || ""}
						onSave={onFileSave}
						key={activeFileId}
					/>
				)}
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
			<NewFileModal
				open={showNewFileModal}
				close={closeNewFileModal}
				fileName={newFileName}
				setFileName={setNewFileName}
				createFile={onClickFileCreate}
			/>
			<HiddenFileUploadInput
				onChange={onFileToUploadChange}
				ref={fileUploadInputRef}
			/>
		</div>
	);
};

export default ProjectEditor;
