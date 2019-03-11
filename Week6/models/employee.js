const mongoose = require("mongoose");

let employeeSchema = require("../schemas/employee.js");
module.exports = mongoose.model('Employee', employeeSchema);;