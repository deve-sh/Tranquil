import { PropsWithChildren } from "react";

interface IconButtonProps extends PropsWithChildren {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler;
	className?: string;
	title?: string;
}

const IconButton = ({
	title,
	children,
	onClick,
	className = "",
}: IconButtonProps) => {
	return (
		<button
			title={title}
			className={`w-auto border rounded-md outline-none border-gray-200 p-3 hover:border-gray-300 hover:bg-slate-100 ${
				className || ""
			}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default IconButton;
