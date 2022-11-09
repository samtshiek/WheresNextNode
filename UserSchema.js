const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    // Extroverted
    extrovertedSum: { type: Number, default: 0 },
    extrovertedCount: { type: Number, default: 0 },
    // Outdoor
    outdoorSum: { type: Number, default: 0 },
    outdoorCount: { type: Number, default: 0 },
    // Active
    activeSum: { type: Number, default: 0 },
    activeCount: { type: Number, default: 0 },
    // Sensitive
    sensitiveSum: { type: Number, default: 0 },
    sensitiveCount: { type: Number, default: 0 },
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