import { useState, type ChangeEvent, type FormEventHandler } from "react";

import type ProjectInfo from "./ProjectInfo.type";

import Button from "../Reusables/Button";
import Input from "../Reusables/Input";

interface Props {
	onSubmit: (projectInfo: ProjectInfo) => any;
	disableInputs?: boolean;
}

const EnterProjectInfo = (props: Props) => {
	const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
		projectName: "",
	});

	const onChange = (event: ChangeEvent) => {
		event.persist();
		const target = event.target as HTMLInputElement;
		setProjectInfo((info) => ({ ...info, [target.name]: target.value }));
	};

	const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		props.onSubmit(projectInfo);
	};

	return (
		<form onSubmit={onSubmit}>
			<Input
				name="projectName"
				value={projectInfo.projectName}
				placeholder="Project Name"
				className="w-full"
				onChange={onChange}
				disabled={props.disableInputs}
			/>
			<Button className="mt-4" disabled={props.disableInputs}>
				Create Project
			</Button>
		</form>
	);
};

export default EnterProjectInfo;
