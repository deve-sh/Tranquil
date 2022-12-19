import { useState } from "react";

import ProjectTemplates from "./ProjectTemplates";
import EnterProjectInfo from "./EnterProjectInfo";
import ProjectInfo from "./ProjectInfo.type";
import Modal from "../Reusables/Modal";

const CreateProject = () => {
	const [selectedTemplate, setSelectedTemplate] = useState("");

	const onSubmitProjectDetails = (projectInfo: ProjectInfo) => {};
	const closeProjectDetailsModal = () => setSelectedTemplate("");

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
				<EnterProjectInfo onSubmit={onSubmitProjectDetails} />
			</Modal>
		</div>
	);
};

export default CreateProject;
