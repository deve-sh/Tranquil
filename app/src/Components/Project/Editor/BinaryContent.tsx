import { BsFileBinary } from "react-icons/bs";

const BinaryContent = () => {
	return (
		<div className="flex h-full items-center justify-center text-white flex-col gap-4 p-4 text-center">
			<div className="text-4xl">
				<BsFileBinary />
			</div>
			<div className="text-lg">
				This file contains binary data. It cannot be previewed or edited here.
			</div>
		</div>
	);
};

export default BinaryContent;
