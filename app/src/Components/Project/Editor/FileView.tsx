import { AiFillFolder, AiFillFolderOpen, AiFillFile } from "react-icons/ai";

import useExpandedDirectories from "../../../stores/ProjectEditor/expandedDirectories";

interface TreeFragment {
	path?: string;
	_id?: string;
	fileName?: string;
	children?: TreeFragment[];
	isDirectory?: boolean;
}

interface Props {
	tree: TreeFragment[];
	className?: string;
	activeFileId?: string;
	onFileClick?: (fileId: string) => any;
}

const Icon = ({ isDirectory = false, expanded = false }) => {
	if (isDirectory) {
		if (expanded) return <AiFillFolderOpen />;
		return <AiFillFolder />;
	}
	return <AiFillFile />;
};

const FileView = ({ tree, className, activeFileId, onFileClick }: Props) => {
	const expanded = useExpandedDirectories((state) => state.expanded);
	const setExpanded = useExpandedDirectories((state) => state.setExpanded);

	return (
		<>
			{tree.map((entry) => {
				const entryId = (entry._id || entry.path) as string;
				return (
					<div key={entryId} className={`${className || ""} p-1`}>
						<div
							className={`fileview-fragment flex items-center gap-2 text-white cursor-pointer ${
								!entry.isDirectory && entry._id === activeFileId
									? "active-file bg-slate-400 px-1 rounded-sm"
									: ""
							}`}
							onClick={() =>
								entry.isDirectory
									? setExpanded(entryId, !expanded[entryId])
									: onFileClick?.(entry._id as string)
							}
						>
							<span className="fileview-fragment-classification">
								<Icon
									isDirectory={entry.isDirectory}
									expanded={expanded[entryId]}
								/>
							</span>
							<span className="fileview-fragment-classification">
								{entry.fileName || entry.path}
							</span>
						</div>
						{entry.isDirectory &&
						entry.children?.length &&
						expanded[entryId] ? (
							<FileView
								tree={entry.children}
								className="ml-4"
								activeFileId={activeFileId}
								onFileClick={onFileClick}
							/>
						) : (
							""
						)}
					</div>
				);
			})}
		</>
	);
};

export default FileView;
