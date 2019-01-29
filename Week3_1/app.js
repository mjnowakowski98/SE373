const express = require("express");
const hbs = require("hbs");
const config = require("./config.js");

const app = express();
app.set("view engine", "handlebars");
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper('colorGrid', (gridSize) => {
	let output = "<table style='margin:0 auto;'><tbody>";
	for(let i = 0; i < gridSize; i++) {
		output += "<tr>";
		for(let j = 0; j < gridSize; j++) {
			let color = ((1 << 24) * Math.random()|0).toString(16);
			output += `<td style="background-color:#${color};">${color}`;
			output += `<br><span style="color:#ffffff;">${color}</span></td>`;
		}
		output += "</tr>";
	}
	output += "</tbody></table>"

	return new hbs.SafeString(output);
});

app.get(["/", "/index"], (req, res) => {
	res.render("index.hbs", { title:"Color Grid Selector", gridSizes: [3,4,5,10,20] });
});

app.get("/grid", (req, res) => {
	let gridSize = req.query["gridSize"] || 0;
	res.render("grid.hbs", { title:"The Grid", gridSize:gridSize });
});

let appPort = config.server.httpPort;
app.listen(appPort, () => {
	console.log(`Webserver listening on port ${appPort}`);
});