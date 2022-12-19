import { useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";

import IconButton from "./IconButton";

interface Props {
	open: boolean;
	close: () => void;
	className?: string;
	children: React.ReactNode;
	title?: string;
}

const Modal = ({ open, title, close, className, children }: Props) => {
	const modalMainContentRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (modalMainContentRef.current && close && open) {
			const listenOutsideModal = (event: any) => {
				if (!modalMainContentRef.current?.contains(event.target as Node))
					close();
			};
			setTimeout(() => window.addEventListener("click", listenOutsideModal));
			return () => window.removeEventListener("click", listenOutsideModal);
		}
	}, [open]);

	return (
		<div
			className={`w-full p-4 bg-black/70 ease-in-out fixed top-0 left-0 right-0 bottom-0 overflow-x-hidden flex items-center justify-center ${
				open ? "translate-y-0" : "-translate-y-full"
			} ${className || ""} modal-container`}
		>
			<div
				className={`modal min-w-[30%] ${
					open ? "translate-y-0" : "-translate-y-full"
				} shadow-lg bg-white rounded-md min-h-fit transition-all ease-in-out duration-300`}
				ref={modalMainContentRef}
			>
				<div className="modal-header p-4 flex items-center border-b-2 border-gray-200">
					<div className="flex-4 text-black font-bold text-xl">{title}</div>
					{close ? (
						<div className="flex-1 pl-4 flex justify-end">
							<IconButton onClick={close}>
								<MdClose className="text-gray-500" />
							</IconButton>
						</div>
					) : (
						""
					)}
				</div>
				<div className="modal-content p-4 py-6">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
