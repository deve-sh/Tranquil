import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type ProjectInfo from "./ProjectInfo.type";

import useToast from "../../hooks/useToast";
import { createProject } from "../../API/Projects";

import Modal from "../Reusables/Modal";

import ProjectTemplates from "./ProjectTemplates";
import EnterProjectInfo from "./EnterProjectInfo";

import addProjectIdToCache from "./utils/addProjectIdToCache";

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

		const projectId = projectCreationResponse?.project?._id;
		navigateTo(`/project/${projectId}`);
		addProjectIdToCache(projectId);
		return setToast({
			type: "success",
			message: "Project created successfully.",
		});
	};

	return (
		<div className="create-project" id="createproject">
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
