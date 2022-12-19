const Image = ({
	className = "",
	containerClass = "",
	src = "",
	alt = "",
	width = 100,
	height = 100,
}) => (
	<div className={`image-container ${containerClass || ""}`}>
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={`${className || ""} mw-full`}
		/>
	</div>
);

export default Image;
