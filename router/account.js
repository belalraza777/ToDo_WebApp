const express = require("express");
const router = express.Router();
const User = require("../model/todoModel");
const bcrypt = require('bcrypt');


const { verifyLogin } = require("./todo");

router.get("/account", verifyLogin, async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    res.render("account.ejs", { user })
});

router.get('/account/password', verifyLogin, (req, res, next) => {
    res.render("changePass.ejs");
});
router.patch("/account/password", verifyLogin, async (req, res, next) => {
    const { password, newPassword } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newPassword, salt, async function (err, hash) {
                        user.password = hash;
                        await user.save();
                        res.redirect("/account");
                    });
                });
            } else {
                res.send("Wrong Password");
            }
        });
    } else {
        res.redirect("/user/login");
    }
});

module.exports = router;