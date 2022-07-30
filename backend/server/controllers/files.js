export const getProjectFileList = (req, res) => {
	const { projectId } = req.params;
	const fileList = [
		{ name: "/index.js", id: "8c3b0553-7d6e-45fa-bab9-d53e2da0f64d" },
	];
	return res.send(fileList);
};

export const getFileContents = (req, res) => {
	const { fileId } = req.params;
	const fileContents = `var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8080);`;
	return res.send(fileContents);
};

export const updateFile = (req, res) => {
	// operation -> update, delete, create
	// if newContent is null, that also technically equates to a delete operation.
	const { fileId, newContent, operation = "update" } = req.body;

	switch (operation) {
		case "create":
			return res.sendStatus(201);
		case "delete":
			return res.sendStatus(204);
		case "update":
			return res.sendStatus(200);
		default:
			return res.sendStatus(200);
	}
};
