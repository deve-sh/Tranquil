import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import Toast from "./Components/Layout/Toast";
import ProjectEditor from "./Components/Project/Editor";

const CreateProject = lazy(() => import("./Components/CreateProject"));

function App() {
	return (
		<>
			<Toast />
			<Route
				path="/createproject"
				element={
					<Suspense fallback={<></>}>
						<CreateProject />
					</Suspense>
				}
			/>
			<Route
				path="/project/:projectId"
				element={
					<Suspense fallback={<></>}>Project Page. Coming soon</Suspense>
				}
			/>
			<Route
				path="/project/:projectId/editor"
				element={
					<Suspense fallback={<></>}>
						<ProjectEditor />
					</Suspense>
				}
			/>
			<Route
				path="/dashboard"
				element={
					<Suspense fallback={<></>}>User Dashboard. Coming soon</Suspense>
				}
			/>
		</>
	);
}

export default App;
