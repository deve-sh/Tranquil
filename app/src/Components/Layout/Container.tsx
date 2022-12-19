interface ContainerProps {
	className?: string;
	children: React.ReactNode | React.ReactNode[];
}

const Container = ({ children, className }: ContainerProps) => (
	<div className={`my-0 mx-auto max-w-5xl ${className || ""}`}>{children}</div>
);

export default Container;
