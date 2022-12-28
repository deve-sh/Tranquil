const getProjectIdsFromCache = () => {
	const existingProjectCache = JSON.parse(
		localStorage.getItem("projects-cache-list") || "[]"
	) as any[];
	return existingProjectCache;
};

export default getProjectIdsFromCache;
