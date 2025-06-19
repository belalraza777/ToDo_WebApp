const mongoose = require("mongoose");

const schema = mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    list: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
            task: { type: String, required: true },
            completed: { type: Boolean, default: false }
        }
    ]
});

const User = mongoose.model("User", schema);

module.exports = User;
