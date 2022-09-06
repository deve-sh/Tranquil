const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 4567;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
	res.send("Hey there from trial app 1234 hey there guys it's so nice here");
});

app.listen(port, () => console.log("Listening at port ", port));
        