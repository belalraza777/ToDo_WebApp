const User = require("../model/todoModel");
const date = require("../util/date")


// GET / - Show all tasks
const getAllTasks = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const list = user.list;
        const dates = date(Date.now());
        res.render("task.ejs", { list, dates, user });
    } catch (err) {
        next(err)
    }
};

// POST / - Add new user
const addTask = async (req, res, next) => {
    const { task } = req.body;
    if (task && task.trim() !== "") {
        try {
            const user = await User.findOne({ email: req.user.email });
            user.list.push({ task: task });
            await user.save();
            res.redirect("/todo/");
        } catch (err) {
            next(err);
        }
    } else {
        const error = new Error("Task is required");
        error.status = 400;
        next(error);
    }
};

// GET /:id - Render edit form
const getEditForm = async (req, res, next) => {
    try {
        const { taskid } = req.params;
        const user = await User.findOne({ email: req.user.email });
        const list = user.list.id(taskid);
        res.render("edit.ejs", { taskid, list });
    } catch (err) {
        next(err)
    }
};

// PATCH /:id - Update user
const updateTask = async (req, res, next) => {
    try {
        const { taskid } = req.params;
        const { task } = req.body;
        const user = await User.findOne({ email: req.user.email });
        const userId = user._id;

        await User.updateOne(
            { _id: userId, "list._id": taskid },
            { $set: { "list.$.task": task.trim() } }
        );

        res.redirect("/todo");
    } catch (err) {
        next(err);
    }
};

// DELETE /:id - Delete task
const deleteTask = async (req, res, next) => {
    try {
        const { taskid } = req.params;
        const user = await User.findOne({ email: req.user.email });
        const userId = user._id;

        await User.updateOne(
            { _id: userId },
            { $pull: { list: { _id: taskid } } }
        );

        res.redirect("/todo");
    } catch (err) {
        next(err);
    }
};

//handle complete task
const completeTask = async (req, res, next) => {
    const { taskid } = req.params;
    const user = await User.findOne({ email: req.user.email });
    const task = user.list.id(taskid);  //Finds the specific task inside the user's list array using its _id. Mongoose provides this .id() helper to search subdocuments by ID.
    if (task) {
        task.completed = !task.completed;
        await user.save();
    } else {
        res.status(404).send("Task not found");
    }
    res.redirect("/todo/");
};


module.exports = {
    getAllTasks,
    addTask,
    getEditForm,
    updateTask,
    deleteTask,
    completeTask
};
