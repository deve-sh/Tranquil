import { MdClose } from "react-icons/md";

import useOpenedFiles from "../../../stores/ProjectEditor/openedFiles";
import FileFromBackend from "../../../types/File";

interface Props {
	files: FileFromBackend[];
	activeFileId: string;
}

const FilesTopPane = ({ files, activeFileId }: Props) => {
	const openedFiles = useOpenedFiles((state) => state.opened);
	const setOpened = useOpenedFiles((state) => state.setOpened);

	const closeOpenedFile = (fileId: string) => {
		if (activeFileId === fileId) return;
		setOpened(fileId, false);
	};

	return (
		<div className="overflow-x-auto w-full h-8 bg-slate-800 pl-2 flex">
			{Object.keys(openedFiles).map((fileId) => {
				if (!openedFiles[fileId]) return <></>;
				const fileInList = files.find((file) => file._id === fileId);
				if (!fileInList) return <></>;

				return (
					<div
						key={fileId}
						className={`text-ellipsis flex items-center overflow-hidden w-fit transition-all py-2 px-4 text-xs text-white cursor-pointer group ${
							activeFileId === fileId ? "bg-editor" : ""
						}`}
					>
						{fileInList.fileName}
						{fileId !== activeFileId && (
							<span
								className="w-0 group-hover:w-fit overflow-hidden cursor-pointer group-hover:ml-3"
								onClick={() => closeOpenedFile(fileId)}
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
