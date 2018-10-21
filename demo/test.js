const express = require("express");
const app = express();

// You'll only need a web server if you don't want to use hash urls
app.use(express.static(__dirname));
app.get("/:page", (req, res) => {
	res.sendFile(require("path").join(__dirname, "index.html"));
});
app.listen(8080, console.log("Server running on localhost:8080"));