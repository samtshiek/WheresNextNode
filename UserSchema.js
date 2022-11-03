const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    // Introverted / Extroverted
    introverted: { type: Number, default: 0 },
    extroverted: { type: Number, default: 0 },
    // Indoor / Outdoor
    outdoor: { type: Number, default: 0 },
    indoor: { type: Number, default: 0 },
    // Active / Inactive
    active: { type: Number, default: 0 },
    inactive: { type: Number, default: 0 },
    // Bar, Museum, Park, Restaurant, Coffee, Trail, Movie
    placeType: { type: Map, of: Number, default: {} }
})

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
    preference: { type: preferenceSchema, default: {}, _id: false }
});

module.exports = mongoose.model("Users", userSchema);