import { useCallback, useRef } from "react";
import { TbRefresh } from "react-icons/tb";
import { VscTerminalBash } from "react-icons/vsc";

interface Props {
	src: string;
	isTerminalOpen?: boolean;
	toggleTerminal?: () => any;
}

const ProjectIframe = ({ src = "", toggleTerminal, isTerminalOpen }: Props) => {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const reloadIframe = useCallback(() => {
		if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
	}, []);

	return (
		<div className="project-editor-iframe-container w-full h-full flex flex-col">
			<div className="bg-slate-800 text-white p-2 pr-4 flex w-full items-center">
				<div className="addressbar w-10/12 rounded h-full min-h-full bg-slate-500" />
				<div className="flex w-2/12 justify-end gap-2">
					<a className="cursor-pointer" onClick={reloadIframe}>
						<TbRefresh />
					</a>
					{toggleTerminal ? (
						<a
							className="cursor-pointer"
							onClick={toggleTerminal}
							title="Open/Close Terminal"
						>
							<VscTerminalBash />
						</a>
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
