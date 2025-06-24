const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/todoModel");


//Login and signUp
router.get("/login", (req, res) => {
    res.render("login.ejs");
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                res.cookie("token", token);
                res.redirect("/todo/");
            } else {
                res.send("something wrong");
            }
        });
    } else {
        res.redirect("/user/login");
    }
});

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});
router.post("/signup", async (req, res, next) => {
    const { email, username, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            const user = new User({ email: email, username: username, password: hash });
            await user.save();
        });
    });
    res.redirect("/todo")
});

router.get("/logout", (req, res, next) => {
    res.clearCookie("token");
    res.redirect("/");
});

module.exports = router;
