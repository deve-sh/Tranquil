export default interface ProjectFromBackend {
	_id: string;
	updatedAt: string;
	createdAt: string;
	template: "CRA" | "Next" | string;
	projectName: string;
}
