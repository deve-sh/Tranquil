// Hidden File Upload Input to be used in tandem with a controlled button in project editor.

import { forwardRef } from "react";
import useToast from "../../../hooks/useToast";

interface Props {
	onChange: (file?: File, rawContents?: string) => any;
}

const MAX_FILE_SIZE = 100 * 1024;

const HiddenFileUploadInput = forwardRef((props: Props, ref: any) => {
	const toast = useToast();

	const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		const file = event.target.files?.[0];
		let fileRawContents;
		if (file) {
			if (file.size >= MAX_FILE_SIZE)
				return toast({
					type: "error",
					message:
						"File too large. Max: " + Math.floor(MAX_FILE_SIZE / 1024) + "KB",
				});

			fileRawContents = await file.text();
		}
		props.onChange(event.target.files?.[0], fileRawContents);
	};

	return <input type="file" className="hidden" ref={ref} onChange={onChange} />;
});

export default HiddenFileUploadInput;
