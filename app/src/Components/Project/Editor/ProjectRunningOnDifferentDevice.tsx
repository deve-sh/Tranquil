import { MdDevices } from "react-icons/md";

const ProjectRunningOnDifferentDevice = () => {
	return (
		<div className="flex h-full items-center justify-center text-white flex-col gap-4 p-4 text-center">
			<div className="text-7xl">
				<MdDevices />
			</div>
			<div className="text-lg">
				This project is already running on a different device.
			</div>
		</div>
	);
};

export default ProjectRunningOnDifferentDevice;
