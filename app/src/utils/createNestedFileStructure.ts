// @ts-ignore
import flatToTree from "flat-to-tree";

import type FileFromBackend from "../types/File";

const getDirectoryFromFilePath = (filePath: string) => {
	const fileNameFragments = filePath.split("/");
	const directoriesInFilename = fileNameFragments
		.slice(0, fileNameFragments.length - 1)
		.join("/");
	return directoriesInFilename;
};

const getFileNameFromFilePath = (filePath: string) => {
	return filePath.split("/").pop();
};

const getFileExtensionFromFilePath = (filePath: string) => {
	return filePath.split(".").pop();
};

const createNestedFileStructure = (fileList: FileFromBackend[]) => {
	let tree: any[] = [];

	// First sort files in order of decreasing nesting.
	let sortedFileList = fileList
		.sort(
			(file1, file2) =>
				file2.path.split(/[\\/]/g).length - file1.path.split(/[\\/]/g).length
		)
		.map((file) => ({
			...file,
			path: file.path.replace(/\\/g, "/"),
		}))
		.map((file) => ({
			...file,
			fileName: getFileNameFromFilePath(file.path),
			extension: getFileExtensionFromFilePath(file.path),
		}));

	// Create entries for individual directories at the top
	let individualDirectories:
		| Set<string>
		| { path: string; isDirectory: true }[] = new Set<string>();
	for (const file of sortedFileList) {
		if (file.path.includes("/")) {
			const fileDirectory = getDirectoryFromFilePath(file.path);
			individualDirectories.add(fileDirectory);
		}
	}
	// Convert set to array. This array will have the most deep nested directories first and the others last. Making it easier for sorting.
	individualDirectories = Array.from(individualDirectories).map((dirName) => ({
		path: dirName,
		isDirectory: true,
		parentId: getDirectoryFromFilePath(dirName),
		fileName: getFileNameFromFilePath(dirName),
	}));

	tree = [...individualDirectories];

	// Add parent IDs to each individual file that's not a directory.
	for (const file of sortedFileList) {
		if (!file.path.includes("/")) {
			tree.push(file);
			continue;
		}

		const directoryOfFile = getDirectoryFromFilePath(file.path);
		tree.push({ ...file, parentId: directoryOfFile });
	}

	// Now use the simple flat-to-tree library to convert this representation into a nested array with directories and files.

	tree = flatToTree(tree, {
		id: "path",
		parentId: "parentId",
		children: "children",
	});

	return [
		{
			fileName: "root",
			path: "root",
			_id: "root",
			isDirectory: true,
			children: tree,
		},
	];
};

export default createNestedFileStructure;
