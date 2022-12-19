import { useState } from "react";

import ProjectTemplates from "./ProjectTemplates";
import EnterProjectInfo from "./EnterProjectInfo";
import ProjectInfo from "./ProjectInfo.type";
import Modal from "../Reusables/Modal";
import { createProject } from "../../API/Projects";
import useToast from "../../hooks/useToast";

const CreateProject = () => {
	const setToast = useToast();

	const [selectedTemplate, setSelectedTemplate] = useState("");

	const [disableInputs, setDisableInputs] = useState(false);
	const closeProjectDetailsModal = () =>
		!disableInputs ? setSelectedTemplate("") : "";
	const onSubmitProjectDetails = async (projectInfo: ProjectInfo) => {
		setDisableInputs(true);
		const { error } = await createProject({
			projectName: projectInfo.projectName,
			template: selectedTemplate,
		});
		setDisableInputs(false);
		if (error) return setToast({ type: "error", message: error?.message });

		closeProjectDetailsModal();
		return setToast({
			type: "success",
			message: "Project created successfully.",
		});
	};

	return (
		<div className="create-project-page">
			<ProjectTemplates
				onSelect={(templateSelected) => setSelectedTemplate(templateSelected)}
			/>
			<Modal
				title="Enter Project Details"
				open={!!selectedTemplate}
				close={closeProjectDetailsModal}
			>
				<EnterProjectInfo
					onSubmit={onSubmitProjectDetails}
					disableInputs={disableInputs}
				/>
			</Modal>
		</div>
	);
};

export default CreateProject;
