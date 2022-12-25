import { useState, useEffect, useRef } from "react";
import { TbRefresh } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { VscTerminalBash, VscDebugRestartFrame } from "react-icons/vsc";
import { MdIntegrationInstructions } from "react-icons/md";

import Button from "../../Reusables/Button";

import { restartProjectAppServer } from "../../../API/Projects";

interface Props {
	projectId?: string;
	src: string;
	toggleTerminal?: () => any;
	toggleUsageInstructions?: () => any;
	onReady: (ref: HTMLIFrameElement) => any;
	reloadIframe: () => any;
}

const ProjectIframe = ({
	projectId,
	src = "",
	toggleTerminal,
	toggleUsageInstructions,
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
				<div className="addressbar w-8/12 rounded h-full min-h-full bg-slate-500" />
				<div className="flex w-4/12 justify-end gap-4">
					<button
						className="cursor-pointer border-none outline-none bg-transparent"
						title="Usage Instructions"
						onClick={toggleUsageInstructions}
					>
						<MdIntegrationInstructions />
					</button>
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
						<VscDebugRestartFrame />
					</button>
					<button
						className="cursor-pointer border-none outline-none bg-transparent"
						title="Refresh Page"
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
			{!src ? (
				<div className="w-full h-full items-center flex justify-center flex-col gap-4 p-4 text-center">
					<AiOutlineLoading3Quarters className="animate-spin text-4xl" />
					<p className="text-lg font-medium">Your Project is loading.</p>
					<p className="text-md">Please check the terminal for logs.</p>
					<Button onClick={toggleTerminal} className="p-2">
						Toggle Terminal
					</Button>
				</div>
			) : (
				<iframe
					src={src}
					className="project-editor-iframe w-full h-full"
					ref={iframeRef}
				/>
			)}
		</div>
	);
};

export default ProjectIframe;
