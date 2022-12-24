import { Fragment, type ReactElement } from "react";
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
}

const FileView = ({ tree, className }: Props) => {
	const expanded = useExpandedDirectories((state) => state.expanded);
	const setExpanded = useExpandedDirectories((state) => state.setExpanded);

	return (
		<>
			{tree.map((entry) => {
				const entryId = entry._id || (entry.path as string);
				return (
					<div key={entryId} className={className}>
						<div
							className="fileview-fragment flex items-center gap-2 cursor-pointer"
							onClick={() => setExpanded(entryId, !expanded[entryId])}
						>
							<span className="fileview-fragment-classification">
								{entry.isDirectory ? "D" : "F"}
							</span>
							<span className="fileview-fragment-classification">
								{entry.fileName || entry.path}
							</span>
						</div>
						{entry.isDirectory &&
						entry.children?.length &&
						expanded[entryId] ? (
							<FileView tree={entry.children} className="ml-4" />
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
