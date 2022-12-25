import Modal from "../../Reusables/Modal";

interface Props {
	open: boolean;
	close: () => any;
}

const Instructions = (props: Props) => {
	return (
		<Modal
			title="Usage FAQs and Instructions"
			open={props.open}
			close={props.close}
		>
			<div className="max-w-2xl">
				Thank you for choosing this environment. Here are some basic answers to
				FAQs and usage instructions:
				<ul className="list-disc ml-6 leading-8">
					<li>Empty directories are not supported and are auto-deleted.</li>
					<li>
						In order to create a directory, simply click on the Create File icon
						in a directory or root folder and add a file expression like you
						would with the directory's name. For example:{" "}
						<code>/dirname/filename.ext</code>.
					</li>
					<li>
						Currently, file renaming support is not present, please delete the
						file and create a new one with a different name.
					</li>
					<li>
						To install dependencies, add them to your package.json file and
						save. The server will auto restart and install the added
						dependencies.
					</li>
					<li>Support for environment variables is coming soon.</li>
					<li>
						Support for having multiple files opened at the same time is coming
						soon.
					</li>
				</ul>
			</div>
		</Modal>
	);
};

export default Instructions;
