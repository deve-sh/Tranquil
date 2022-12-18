import { useCallback, useRef } from "react";
import { TbRefresh } from "react-icons/tb";

const ProjectIframe = ({ src = "" }) => {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const reloadIframe = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
	}, []);

	return (
		<div className="project-editor-iframe-container w-full h-full flex flex-col">
			<div className="bg-slate-800 text-white p-2 pr-4 flex w-full">
				<div className="addressbar w-11/12 rounded h-full min-h-full bg-slate-500" />
				<a href="#" onClick={reloadIframe} className="flex w-1/12 justify-end">
					<TbRefresh />
				</a>
			</div>
			<iframe
				src={src || "https://google.com/"}
				className="project-editor-iframe w-full h-full"
				ref={iframeRef}
			/>
		</div>
	);
};

export default ProjectIframe;
