import { useEffect } from "react";
import useExpandedDirectories from "../../../../stores/ProjectEditor/expandedDirectories";

import type FileFromBackend from "../../../../types/File";
import { getDirectoryFromFilePath } from "../../../../utils/createNestedFileStructure";

const useExpandDirsForActiveFile = (
	activeFileId: string,
	fileList: FileFromBackend[]
) => {
	const setExpanded = useExpandedDirectories((state) => state.setExpanded);

	useEffect(() => {
		// Expand all the directories it's contained in.
		if (fileList.length && activeFileId) {
			const file = fileList.find((file) => file._id === activeFileId);
			if (file) {
				const directories = getDirectoryFromFilePath(file.path);
				const directoryList = directories.split("/");
				for (const directoryPath of directoryList)
					setExpanded(directoryPath, true);
			}
		}
	}, [activeFileId, fileList]);
};

export default useExpandDirsForActiveFile;
