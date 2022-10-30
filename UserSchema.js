const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number },
    sex: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    createdAt: { type: Date, immutable: true },
    email: { type: String },
});

module.exports = mongoose.model("Users", userSchema);