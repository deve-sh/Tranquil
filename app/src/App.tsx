import { useState } from "react";
import EditorBase from "./Project/Editor/Base";

function App() {
	const [code, setCode] = useState(`function add(x, y){ return x + y; }`);

	return <EditorBase code={code} onChange={(_, __, value) => setCode(value)} />;
}

export default App;
