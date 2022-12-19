import { useState } from "react";
import CreateProject from "./Components/CreateProject";
import Toast from "./Components/Layout/Toast";
import ProjectEditor from "./Components/Project/Editor";

function App() {
	return (
		<>
			<Toast />
			<CreateProject />
		</>
	);
}

export default App;
