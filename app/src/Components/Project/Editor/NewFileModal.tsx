import Button from "../../Reusables/Button";
import Input from "../../Reusables/Input";
import Modal from "../../Reusables/Modal";

interface Props {
	open: boolean;
	close: () => any;
	fileName: string;
	setFileName: (value: string) => any;
	createFile: () => any;
}

const NewFileModal = ({ open, close, fileName, setFileName }: Props) => {
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		event.persist();
		setFileName(event.target.value);
	};

	const onSubmit: React.FormEventHandler = (event) => {
		event.preventDefault();
	};

	return (
		<Modal open={open} close={close} title="Create New File">
			<form onSubmit={onSubmit}>
				<Input
					value={fileName}
					className="w-full"
					onChange={onChange}
					placeholder="File Name"
				/>
				<Button className="w-full mt-4" type="submit">
					Create
				</Button>
			</form>
		</Modal>
	);
};

export default NewFileModal;
