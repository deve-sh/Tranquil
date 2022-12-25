import { AiFillFolder, AiFillFolderOpen, AiFillFile } from "react-icons/ai";
import {
	SiJavascript,
	SiTypescript,
	SiCss3,
	SiHtml5,
	SiMarkdown,
	SiReact,
} from "react-icons/si";
import { MdDelete } from "react-icons/md";
import { VscJson } from "react-icons/vsc";
import { BsFileEarmarkPlusFill } from "react-icons/bs";

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
	onClickFileCreate?: (dirName: string) => any;
	onClickFileDelete?: (fileId: string) => any;
}

const Icon = ({ isDirectory = false, expanded = false, extension = "" }) => {
	if (isDirectory) {
		if (expanded) return <AiFillFolderOpen />;
		return <AiFillFolder />;
	}
	if (["js"].includes(extension)) return <SiJavascript />;
	if (["ts"].includes(extension)) return <SiTypescript />;
	if (["jsx", "tsx"].includes(extension)) return <SiReact />;
	if (["css", "scss"].includes(extension)) return <SiCss3 />;
	if (["html", "htm"].includes(extension)) return <SiHtml5 />;
	if (["md", "mdx"].includes(extension)) return <SiMarkdown />;
	if (["json"].includes(extension)) return <VscJson />;
	return <AiFillFile />;
};

const FileView = ({
	tree,
	className,
	activeFileId,
	onFileClick,
	onClickFileCreate,
	onClickFileDelete,
}: Props) => {
	const expanded = useExpandedDirectories((state) => state.expanded);
	const setExpanded = useExpandedDirectories((state) => state.setExpanded);

	return (
		<>
			{tree.map((entry) => {
				const entryId = (entry._id || entry.path) as string;
				const extension = !entry.isDirectory
					? (entry.fileName || entry.path)?.split(".").pop()
					: "";
				return (
					<div key={entryId} className={`${className || ""} p-1`}>
						<div
							className={`fileview-fragment flex items-center gap-2 group text-white cursor-pointer ${
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
							<div className="w-11/12 flex items-center gap-2">
								<div className="fileview-fragment-classification">
									<Icon
										isDirectory={entry.isDirectory}
										expanded={expanded[entryId]}
										extension={extension}
									/>
								</div>
								<div className="fileview-fragment-classification">
									{entry.fileName || entry.path}
								</div>
							</div>
							<div className="w-1/12 text-sm text-gray-400 hidden group-hover:block hover:text-white">
								{entry.isDirectory ? (
									<BsFileEarmarkPlusFill
										onClick={(event) => {
											event.stopPropagation();
											onClickFileCreate?.(entry.path as string);
										}}
									/>
								) : (
									<MdDelete
										onClick={(event) => {
											event.stopPropagation();
											onClickFileDelete?.(entry._id as string);
										}}
									/>
								)}
							</div>
						</div>
						{entry.isDirectory &&
						entry.children?.length &&
						expanded[entryId] ? (
							<FileView
								tree={entry.children}
								className="ml-4"
								activeFileId={activeFileId}
								onFileClick={onFileClick}
								onClickFileCreate={onClickFileCreate}
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
