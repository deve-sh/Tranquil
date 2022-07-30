export const getProjectFileList = (req, res) => {
	const { projectId } = req;
	const fileList = [
		{ name: "/index.js", id: "8c3b0553-7d6e-45fa-bab9-d53e2da0f64d" },
	];
	return res.send(fileList);
};

export const getFileContents = (req, res) => {
	const { fileId } = req;
	const fileContents = `var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');
}).listen(8080);`;
	return res.send(fileContents);
};
