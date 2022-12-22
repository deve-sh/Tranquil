import { useState, useEffect, useRef } from "react";
import { TbRefresh } from "react-icons/tb";
import { VscTerminalBash, VscDebugRestartFrame } from "react-icons/vsc";
import { restartProjectAppServer } from "../../../API/Projects";

interface Props {
	projectId?: string;
	src: string;
	toggleTerminal?: () => any;
	onReady: (ref: HTMLIFrameElement) => any;
	reloadIframe: () => any;
}

const ProjectIframe = ({
	projectId,
	src = "",
	toggleTerminal,
	onReady,
	reloadIframe,
}: Props) => {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const [disableButtons, setDisableButtons] = useState(false);

	useEffect(() => {
		if (iframeRef.current && onReady) onReady(iframeRef.current);
	}, []);

	return (
		<div className="project-editor-iframe-container w-full h-full flex flex-col">
			<div className="bg-slate-800 text-white p-2 pr-4 flex w-full items-center">
				<div className="addressbar w-10/12 rounded h-full min-h-full bg-slate-500" />
				<div className="flex w-2/12 justify-end gap-2">
					<button
						className="cursor-pointer border-none outline-none bg-transparent"
						title="Restart App Server"
						onClick={async () => {
							setDisableButtons(true);
							if (projectId) await restartProjectAppServer(projectId);
							setDisableButtons(false);
						}}
						disabled={disableButtons}
					>
						<TbRefresh />
					</button>
					<button
						className="cursor-pointer border-none outline-none bg-transparent"
						onClick={reloadIframe}
						disabled={disableButtons}
					>
						<TbRefresh />
					</button>
					{toggleTerminal ? (
						<button
							className="cursor-pointer border-none outline-none bg-transparent"
							onClick={toggleTerminal}
							title="Open/Close Terminal"
						>
							<VscTerminalBash />
						</button>
					) : (
						""
					)}
				</div>
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
