import { useEffect } from "react";
import { MdError, MdInfo } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";

import useToastStore, { type ToastState } from "../../stores/toast";
import useToast from "../../hooks/useToast";

const toastColorMapByType = {
	error: "bg-red-600",
	success: "bg-emerald-800",
	info: "bg-blue-400",
};

const toastIconMapByType = {
	error: <MdError />,
	info: <MdInfo />,
	success: <RiCheckDoubleFill />,
};

const MAX_TOAST_DURATION = 5000;
const DEFAULT_TOAST_STATE = { show: false, message: null, type: "info" };

const Toast = () => {
	const { show, type = "info", message } = useToastStore();
	const setToast = useToast();

	useEffect(() => {
		if (show) {
			const timeout = setTimeout(
				() => setToast(DEFAULT_TOAST_STATE as ToastState),
				MAX_TOAST_DURATION
			);
			return () => clearTimeout(timeout);
		}
	}, [show]);

	return (
		<div
			className={`
        fixed
        top-8
        right-8
        shadow-lg
        rounded-md
        flex
        gap-3
        items-center
        transition-all
        text-white
        p-4
        z-50
        max-w-sm
        ${show ? "translate-x-0" : "translate-x-52"}
        ${toastColorMapByType[type]}
    `}
		>
			{toastIconMapByType[type]} {message}
		</div>
	);
};

export default Toast;
