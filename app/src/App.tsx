import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Toast from "./Components/Layout/Toast";

// Socket
import "./socket";

const CreateProject = lazy(() => import("./Components/CreateProject"));
const ProjectPage = lazy(() => import("./Components/Project/Editor"));

function App() {
	return (
		<>
			<Toast />
			<Routes>
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
						<Suspense fallback={<></>}>
							<ProjectPage />
						</Suspense>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<Suspense fallback={<></>}>User Dashboard. Coming soon</Suspense>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
