const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const engine = require('ejs-mate');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const todoRouter = require("./router/todo");
const authRouter = require("./router/auth");
const accountRouter = require("./router/account");
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/TODO').then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

//set views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', engine);

//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

//route
app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.use("/user", authRouter);
app.use("/todo", todoRouter.router);
app.use("/",accountRouter);

//error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "some error" } = err;
    res.status(status).send({ message });
});

app.listen(8080, () => {
    console.log("Server Running at 8080");
});