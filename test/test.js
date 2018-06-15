const express = require("express");
const app = express();

app.use(express.static(__dirname));
app.get("/:page", (req, res) => {
	res.sendFile(require("path").join(__dirname, "index.html"));
});
app.listen(8080, console.log("Server running on localhost:8080"));