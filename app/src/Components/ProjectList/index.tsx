import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type ProjectFromBackend from "../../types/Project";
import { getUserProjects } from "../../API/Projects";

import Container from "../Layout/Container";
import Image from "../Reusables/Image";
import { getTemplateInfoFromId } from "../CreateProject/templateList";

const Project = ({ project }: { project: ProjectFromBackend }) => (
	<Link
		to={`/project/${project._id}`}
		className="flex items-center gap-3 rounded-lg border p-3 text-slate-700 hover:scale-105 transition-all ease-in-out"
	>
		<Image
			src={getTemplateInfoFromId(project.template)?.image}
			className="rounded-lg w-[3.5rem] h-[3.5rem] object-cover"
		/>
		{project.projectName}
	</Link>
);

const ProjectList = () => {
	const [projects, setProjects] = useState<ProjectFromBackend[]>([]);

	useEffect(() => {
		getUserProjects().then(({ data: projectsFromBackend }) =>
			setProjects(projectsFromBackend)
		);
	}, []);

	return (
		<>
			{projects.length ? (
				<Container className="py-4">
					<h4 className="text-2xl text-slate-700 mb-4 text-center font-bold">
						Or pick up where you left off
					</h4>
					<div className="project-list flex justify-center items-center flex-wrap gap-8 p-4">
						{projects.map((project) => (
							<Project key={project._id} project={project} />
						))}
					</div>
				</Container>
			) : (
				""
			)}
		</>
	);
};

export default ProjectList;
