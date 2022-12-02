const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    // Extroverted
    extroverted: { type: Number, default: 0 },
    // Outdoor
    outdoor: { type: Number, default: 0 },
    // Active
    active: { type: Number, default: 0 },
    // Sensitive
    sensitive: { type: Number, default: 0 },
    // Bar, Museum, Park, Restaurant, Coffee, Trail, Movie
    radius: { type: Number, default: 0 },
    placeType: { type: Map, of: Array, default: {} },
    quizResult: { type: Map, of: Number, default: {} },
    favoritePlaces: { type: Map, of: Array, default: {}  }
})

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    hasTakenQuiz: {type: Boolean, default: false},
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