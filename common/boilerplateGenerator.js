const { promisify } = require("util");
const { resolve } = require("path");
const fs = require("fs");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function readDir(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(
		subdirs.map(async (subdir) => {
			const res = resolve(dir, subdir);
			return (await stat(res)).isDirectory() ? readDir(res) : res;
		})
	);
	return files.reduce((a, f) => a.concat(f), []);
}

readDir("./")
	.then((files) =>
		files.map((path) =>
			path.replace(
				"C:\\Users\\deves\\Desktop\\Personal Projects\\real-time-online-dev-env\\cra-boilerplate\\",
				""
			)
		)
	)
	.then((files) => {
		const boilerPlateContents = files
			.map((filePath) => {
				if (
					filePath.includes("package-lock") ||
					filePath.includes(".env") ||
					filePath.includes("boilerplate.js")
				)
					return null;
				const contents = fs.readFileSync("./" + filePath, "utf-8");
				const path = filePath;
				return { path, contents };
			})
			.filter((entry) => !!entry);
		return boilerPlateContents;
	})
	.then((json) =>
		fs.writeFileSync("./boilerplate.js", JSON.stringify(json, null, 4))
	);
