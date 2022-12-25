import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Toast from "./Components/Layout/Toast";

// Socket
import "./socket";

const Footer = lazy(() => import("./Components/Layout/Footer"));

const Homepage = lazy(() => import("./Components/Home"));
const ProjectPage = lazy(() => import("./Components/Project/Editor"));

function App() {
	return (
		<>
			<Toast />
			<Routes>
				<Route
					path="/"
					element={
						<Suspense fallback={<></>}>
							<Homepage />
							<Footer />
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
			</Routes>
		</>
	);
}

export default App;
