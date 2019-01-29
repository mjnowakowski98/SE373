const express = require("express");
const hbs = require("hbs");
const config = require("./config.js");

const app = express();
app.set("view engine", "handlebars");
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

app.get(["/", "/index"], (req, res) => {
	res.render("index.hbs", { title:"Color Grid Selector", gridSizes: [3,4,5,10,20] });
});

app.get("/grid", (req, res) => {
	let gridSize = req.query["gridSize"] || 0;

	let rows = new Array();
	for(let i = 0; i < gridSize; i++) {
		let cols = new Array();
		for(let j = 0; j < gridSize; j++) {
			let color = ((1 << 24) * Math.random()|0).toString(16);
			cols.push(color);
		}
		rows.push(cols);
	}

	res.render("grid.hbs", { title:"The Grid", colorGrid:rows });
});

app.get('*', (req, res) => {
	res.render("error.hbs", { errCode:404 });
});

let appPort = config.server.httpPort;
app.listen(appPort, () => {
	console.log(`Webserver listening on port ${appPort}`);
});