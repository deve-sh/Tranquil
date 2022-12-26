import { PropsWithChildren } from "react";

interface IconButtonProps extends PropsWithChildren {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler;
	className?: string;
	title?: string;
	type?: "submit" | "reset";
}

const IconButton = ({
	title,
	children,
	type,
	onClick,
	className = "",
}: IconButtonProps) => {
	return (
		<button
			title={title}
			className={`w-auto border rounded-md outline-none border-gray-200 p-3 hover:border-gray-300 hover:bg-slate-100 text-lg ${
				className || ""
			}`}
			type={type}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default IconButton;
