const addProjectIdToCache = (projectId: string) => {
	const existingProjectCache = JSON.parse(
		localStorage.getItem("projects-cache-list") || "[]"
	) as any[];
	return localStorage.setItem(
		"projects-cache-list",
		JSON.stringify(existingProjectCache.concat(projectId))
	);
};

export default addProjectIdToCache;
