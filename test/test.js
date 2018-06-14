const fs = require("fs");
const express = require("express");
const app = express();
const pj = require("path").join;

app.use(express.static(pj(__dirname)));
app.get("/:page", (req, res) => {
	res.sendFile(pj(__dirname, "index.html"));
});
app.listen(8080);