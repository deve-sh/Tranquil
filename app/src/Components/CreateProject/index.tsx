import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectTemplates from "./ProjectTemplates";
import EnterProjectInfo from "./EnterProjectInfo";
import ProjectInfo from "./ProjectInfo.type";
import Modal from "../Reusables/Modal";
import { createProject } from "../../API/Projects";
import useToast from "../../hooks/useToast";

const CreateProject = () => {
	const setToast = useToast();
	const navigateTo = useNavigate();

	const [selectedTemplate, setSelectedTemplate] = useState("");

	const [disableInputs, setDisableInputs] = useState(false);
	const closeProjectDetailsModal = () =>
		!disableInputs ? setSelectedTemplate("") : "";
	const onSubmitProjectDetails = async (projectInfo: ProjectInfo) => {
		setDisableInputs(true);
		const { error, data: projectCreationResponse } = await createProject({
			projectName: projectInfo.projectName,
			template: selectedTemplate,
		});
		setDisableInputs(false);
		if (error) return setToast({ type: "error", message: error?.message });

		closeProjectDetailsModal();
		navigateTo(`/project/${projectCreationResponse?.project?._id}`);
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
