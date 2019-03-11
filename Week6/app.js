const express = require("express");
const app = express();
const hbs = require("hbs");
const mongoose = require("mongoose");

const Employee = require("./models/employee.js");

let dbConnected = false;

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended:true }));
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

mongoose.connect("mongodb://localhost/Empl", { useNewUrlParser:true });
const db = mongoose.connection;
db.on("error", (err) => console.error("Database error:" + err));
db.once("open", () => {
    console.log("MongoDB connection established");
    dbConnected = true;
});

app.get(["/", "/index"], (req, res) => {
    res.render("index.hbs");
});

app.get("/editemployee", (req, res) => {
    Employee.findById(req.query.id, (err, employee) => {
        if(err) console.error(err);
        res.render("editemployee.hbs", { employee });
    });
});

app.post("/editemployee", (req, res) => {
    let updateObj = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        department:req.body.department,
        startDate:req.body.startDate,
        jobTitle:req.body.jobTitle,
        salary:req.body.salary
    };

    Employee.findOneAndUpdate({ _id:req.body.id}, updateObj, (err, employee) => {
        if(err) console.error(err);
        res.redirect("/viewemployees");
    });
});

app.get("/deleteemployee", (req, res) => {
    Employee.findById(req.query.id, (err, employee) => {
        if(err) console.error(err);
        res.render("deleteemployee.hbs", { employee });
    });
});

app.post("/deleteemployee", (req, res) => {
    Employee.findOneAndDelete({ _id:req.body.id}, (err, employee) => {
        if(err) console.error(err);
        res.redirect("/viewemployees");
    });
});

app.get("/viewemployees", (req, res) => {
    Employee.find((err, employees) => {
        if(err) {
            res.render("viewemployees.hbs", { employees, readFailState:true })
            return console.error(err);
        }
        res.render("viewemployees.hbs", { employees });
    });
});

app.post("/createemployee", (req, res) => {
    if(!dbConnected) { res.render("index.hbs", {createFailState:true, postData: req.body}); return; }
    let newEmployee = new Employee({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        department:req.body.department,
        startDate:req.body.startDate,
        jobTitle:req.body.jobTitle,
        salary:req.body.salary
    });

    newEmployee.save((err, employee) => {
        console.log(`Saved new employee: ${employee}`);
        if(err) {
            res.render("index.js", { createFailState:true, postData: req.body });
            return console.error(err);
        }
        res.redirect("/viewemployees");
    });
});


app.listen(3000, () => console.log("Listening on: 3000"));