const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const pasteRoutes = require('./routes/pasteRoutes');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "view")));
app.use('/',pasteRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/pastebin");


app.listen(8000,()=>{
    console.log("App running on the port 8000");
})