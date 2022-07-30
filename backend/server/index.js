import express from "express";
import filesRouter from "./routes/files";

const app = express();
const PORT = process.env.PORT || 8080;

app.use("*", (req, _, next) => {
	console.log("Request at: ", req.url);
	next();
});

app.use("/files", filesRouter);

app.listen(PORT, () => console.log("App running at port: ", PORT));
