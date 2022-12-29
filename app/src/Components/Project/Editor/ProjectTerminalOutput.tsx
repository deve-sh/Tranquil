import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

interface Props {
	logs: string[];
	isOpen: boolean;
	toggle: () => any;
}

const ProjectTerminalOutput = ({ logs, isOpen, toggle }: Props) => {
	const terminalDiv = useRef<HTMLDivElement | null>(null);
	const [hasUserScrolledOnce, setHasUserScrolledOnce] = useState(false);

	useEffect(() => {
		// Logs length has changed.
		// Scroll to the end of the div
		if (terminalDiv.current && !hasUserScrolledOnce)
			terminalDiv.current.scrollTop = terminalDiv.current.scrollHeight;
	}, [logs.length, hasUserScrolledOnce]);

	return (
		<div
			className={`project-terminal-output fixed bottom-0 left-0 right-0 ${
				isOpen ? "" : "translate-y-full"
			}`}
		>
			<a
				href="#"
				onClick={(e) => {
					e.preventDefault();
					toggle();
				}}
				className="absolute top-4 right-4 text-white text-lg"
			>
				<MdClose />
			</a>
			<div
				className={`project-terminal
                bg-black
                text-white
                font-mono
                border-t-2
                border-gray-600
                flex
                flex-col
                gap-2
                overflow-y-auto
                h-64
                p-4
                `}
				ref={terminalDiv}
				onScroll={() => setHasUserScrolledOnce(true)}
			>
				{logs.map((log, index) => (
					<div key={index}>{log}</div>
				))}
			</div>
		</div>
	);
};

export default ProjectTerminalOutput;
