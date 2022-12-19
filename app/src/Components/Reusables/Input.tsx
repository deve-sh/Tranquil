interface InputProps {
	value: string | number | undefined;
	onChange?: React.ChangeEventHandler;
	type?: "email" | "text" | "number" | "password";
	className?: string;
	required?: boolean;
	disabled?: boolean;
	name?: string;
	placeholder?: string;
	autoFocus?: boolean;
}

const Input = ({
	value,
	required = false,
	onChange,
	type = "text",
	className,
	disabled,
	placeholder,
	name,
	autoFocus = false,
}: InputProps) => (
	<input
		className={`rounded-lg text-gray-600 placeholder:text-gray-400 p-3 transition-all border-gray-200 outline-none focus:border-teal-700 border-2 border-solid input disabled:bg-gray-200 ${
			className || ""
		}`}
		name={name}
		type={type}
		onChange={onChange}
		value={value}
		required={required}
		placeholder={placeholder}
		disabled={disabled}
		autoFocus={autoFocus}
	/>
);

export default Input;
