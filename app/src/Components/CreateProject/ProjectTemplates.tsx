import { useCallback, type MouseEvent } from "react";

import Image from "../Reusables/Image";
import Container from "../Layout/Container";

import templateList from "./templateList";

interface Props {
	onSelect: (id: string) => any;
}

const ProjectTemplates = (props: Props) => {
	const onClick = useCallback(
		(templateId: string) => (event: MouseEvent) => {
			event.preventDefault();
			props.onSelect(templateId);
		},
		[]
	);

	return (
		<Container className="py-4">
			<h4 className="text-2xl font-medium text-slate-900 mb-4">
				Select A Project Template
			</h4>
			<div className="project-templates flex justify-center items-center flex-wrap gap-8 p-4">
				{templateList.map((template) => (
					<a
						className="template relative shadow-lg hover:shadow-2xl hover:scale-105 transition-all ease-in-out h-40 w-64 rounded-lg overflow-hidden"
						key={template.id}
						href="#"
						onClick={onClick(template.id)}
						title={template.label}
					>
						<Image
							src={template.image}
							className="h-full absolute w-full object-cover top-0 right-0 left-0 bottom-0"
							alt={template.label}
						/>
					</a>
				))}
			</div>
		</Container>
	);
};

export default ProjectTemplates;
