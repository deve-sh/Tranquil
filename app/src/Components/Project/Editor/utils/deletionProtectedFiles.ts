const deletionProtectedFiles: string[] = ["package.json"];

const isDeletionProtectedFile = (filePath: string) => {
	for (const file of deletionProtectedFiles)
		if (filePath.includes(filePath)) return true;
	return false;
};

export default isDeletionProtectedFile;
