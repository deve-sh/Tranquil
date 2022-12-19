interface ButtonProps {
	type?: "submit" | "button" | "reset";
	className?: string;
	disabled?: boolean;
	onClick?: React.MouseEventHandler;
	children?: React.ReactNode | React.ReactNode[];
	variant?: "contained" | "outlined" | "ghost";
}

const Button = ({
	type,
	className,
	disabled,
	onClick,
	variant = "contained",
	children,
}: ButtonProps) => (
	<button
		onClick={onClick}
		className={`rounded-lg
        ${variant === "contained" ? "bg-teal-700" : ""}
        ${variant !== "ghost" ? "border-2 border-teal-700" : ""}
        ${variant !== "contained" ? "text-teal-700" : "text-white"}
        ${variant !== "contained" ? "hover:bg-teal-200/20" : ""}
        p-3
		${variant !== "ghost" && !disabled ? "hover:scale-105" : ""}
        transition-all
		ease-in-out
        ${
					variant === "contained"
						? "active:bg-teal-800 active:border-teal-800"
						: ""
				}
        button
        disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300
        ${className || ""}`}
		type={type}
		disabled={disabled}
	>
		{children}
	</button>
);

export default Button;
