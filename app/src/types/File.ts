export default interface FileFromBackend {
	_id: string | number;
	updatedAt?: string;
	createdAt?: string;
	path: string;
	isReadableContent?: boolean;
}
