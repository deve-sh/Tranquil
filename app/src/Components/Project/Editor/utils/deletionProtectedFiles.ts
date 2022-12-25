const deletionProtectedFiles: string[] = ["package.json"];

const isDeletionProtectedFile = (filePath: string) => {
	for (const file of deletionProtectedFiles)
		if (file.includes(filePath)) return true;
	return false;
};

export default isDeletionProtectedFile;
