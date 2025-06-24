const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
    getAllTasks,
    addTask,
    getEditForm,
    updateTask,
    deleteTask,
    completeTask
} = require("../controller/notesController");

//verfiy User Login
function verifyLogin(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.redirect("user/login");
            req.user = user;
            return next();
        });
    }else{
            return res.redirect("user/login");
    }
}

// Routes
router.get("/",verifyLogin, getAllTasks);
router.post("/",verifyLogin, addTask);
router.get("/:taskid",verifyLogin, getEditForm);
router.patch("/:taskid",verifyLogin, updateTask);
router.delete("/:taskid",verifyLogin, deleteTask);
router.post("/:taskid/completed",verifyLogin,completeTask);
module.exports = {router,verifyLogin};
