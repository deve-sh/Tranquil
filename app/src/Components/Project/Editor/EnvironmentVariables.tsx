import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { BsPlus, BsTrash } from "react-icons/bs";
import { TbVariable } from "react-icons/tb";

import IconButton from "../../Reusables/IconButton";
import Input from "../../Reusables/Input";
import Modal from "../../Reusables/Modal";

import isProtectedEnvironmentVariable from "./utils/protectedEnvironmentVars";
import useToast from "../../../hooks/useToast";
import {
	createProjectEnvVar,
	getProjectEnvVars,
	removeProjectEnvVar,
} from "../../../API/EnvVariables";

interface Props {
	open: boolean;
	close: () => any;
}

const EnvironmentVariables = (props: Props) => {
	const { projectId } = useParams();
	const toast = useToast();

	const [variables, setVariables] = useState<any[]>([]);

	const fetchAndSetEnvironmentVariables = () => {
		if (!projectId) return;

		getProjectEnvVars(projectId).then(({ data: response }) =>
			setVariables(response.variables)
		);
	};

	// New Environment Variable
	const [newVariableKey, setNewVariableKey] = useState("");
	const [newVariableValue, setNewVariableValue] = useState("");
	const handleNewVariableChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target.name === "key") setNewVariableKey(event.target.value);
		if (event.target.name === "value") setNewVariableValue(event.target.value);
	};
	const createNewVariable: React.FormEventHandler = async (event) => {
		event.preventDefault();

		if (!newVariableKey || !projectId || !newVariableValue) return;

		if (isProtectedEnvironmentVariable(newVariableKey))
			return toast({
				type: "error",
				message: "Protected Environment Variable",
			});

		const { error } = await createProjectEnvVar(projectId, {
			key: newVariableKey,
			value: newVariableValue,
		});
		if (error) return toast({ type: "error", message: error.message });
		setNewVariableKey("");
		setNewVariableValue("");
		fetchAndSetEnvironmentVariables();
	};

	useEffect(() => {
		fetchAndSetEnvironmentVariables();
	}, [projectId]);

	const removeVariable = async (variableId: string) => {
		if (!projectId) return;

		const { error } = await removeProjectEnvVar(projectId, variableId);
		if (error) return toast({ type: "error", message: error.message });
		fetchAndSetEnvironmentVariables();
	};

	return (
		<Modal
			title="Project Environment Variables"
			open={props.open}
			close={props.close}
		>
			<form
				className="new-env-variable flex items-center gap-4"
				onSubmit={createNewVariable}
			>
				<Input
					className="w-5/12"
					onChange={handleNewVariableChange}
					value={newVariableKey}
					name="key"
					placeholder="Key"
				/>
				<Input
					className="w-5/12"
					onChange={handleNewVariableChange}
					value={newVariableValue}
					name="value"
					placeholder="Value"
				/>
				<div className="text-right">
					<IconButton className="h-full" type="submit">
						<BsPlus />
					</IconButton>
				</div>
			</form>
			<div className="mt-3 text-slate-600">
				{variables.length ? (
					variables.map((variable) => (
						<div key={variable._id} className="flex items-center gap-4 mt-4">
							<Input
								className="w-5/12"
								disabled
								value={variable.key}
								name="key"
								placeholder="Key"
							/>
							<Input
								className="w-5/12"
								disabled
								value="********"
								name="value"
								placeholder="Value"
							/>
							<div className="text-right">
								<IconButton
									className="h-full text-red-600"
									title="Remove Variable"
									onClick={() => removeVariable(variable._id)}
								>
									<BsTrash />
								</IconButton>
							</div>
						</div>
					))
				) : (
					<div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
						<div className="text-3xl">
							<TbVariable />
						</div>
						<div className="text-xl max-w-[500px] text-center">
							Use Environment variables to add sensitive/non-frequently changing
							information to your app.
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default EnvironmentVariables;
