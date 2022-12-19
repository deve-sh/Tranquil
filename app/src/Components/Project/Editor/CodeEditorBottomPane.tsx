interface Props {
	language?: string;
	lineNumber?: number;
	colNumber?: number;
}

const CodeEditorBottomPane = ({
	language = "javascript",
	lineNumber = 0,
	colNumber = 0,
}: Props) => {
	return (
		<div className="project-editor-code-editor-bottom-pane flex items-center gap-4 justify-end p-1 pr-2 bg-editorpane text-xs color-white">
			<div>
				Ln {lineNumber}, Col {colNumber}
			</div>
			<div className="capitalize">{language}</div>
		</div>
	);
};

export default CodeEditorBottomPane;
