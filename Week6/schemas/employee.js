const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    department:String,
    startDate:Date,
    jobTitle:String,
    salary:Number
});

schema.methods.complain = function() { return this.firstName + "is complaining"; }
schema.methods.work = function() { return this.firstName + "is working"; }

module.exports = schema;