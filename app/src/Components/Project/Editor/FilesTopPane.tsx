import { Fragment } from "react";
import { MdClose } from "react-icons/md";

import useOpenedFiles from "../../../stores/ProjectEditor/openedFiles";
import FileFromBackend from "../../../types/File";

interface Props {
	files: FileFromBackend[];
	activeFileId: string;
	onFileClick: (fileId: string) => any;
}

const FilesTopPane = ({ files, activeFileId, onFileClick }: Props) => {
	const openedFiles = useOpenedFiles((state) => state.opened);
	const setOpened = useOpenedFiles((state) => state.setOpened);

	const closeOpenedFile = (fileId: string) => {
		if (activeFileId === fileId) return;
		setOpened(fileId, false);
	};

	return (
		<div className="project-editor-files-top-pane overflow-x-auto w-full h-8 bg-slate-800 pl-2 flex border-r-2 border-slate-700">
			{Object.keys(openedFiles).map((fileId) => {
				if (!openedFiles[fileId]) return <Fragment key={fileId} />;
				const fileInList = files.find((file) => file._id === fileId);
				if (!fileInList) return <Fragment key={fileId} />;

				return (
					<div
						key={fileId}
						className={`flex items-center min-w-fit overflow-hidden transition-all ease-in-out py-2 px-4 text-xs text-white cursor-pointer group ${
							activeFileId === fileId ? "bg-editor" : ""
						}`}
						onClick={() =>
							activeFileId !== fileId ? onFileClick(fileId) : null
						}
					>
						{fileInList.fileName}
						{fileId !== activeFileId && (
							<span
								className="w-0 group-hover:w-fit overflow-hidden cursor-pointer group-hover:ml-3"
								onClick={(e) => {
									e.stopPropagation();
									closeOpenedFile(fileId);
								}}
							>
								<MdClose />
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default FilesTopPane;
