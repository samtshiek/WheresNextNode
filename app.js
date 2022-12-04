const express = require('express');
const app = express(); 
require('dotenv').config();

// CORS
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json())

// mongoDB connection
const mongoose = require("mongoose");

const mongoDBURI = process.env.mongoDBURI;
mongoose.connect(mongoDBURI).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);

// router
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/', authRouter);
app.use('/users', userRouter);

// It'll use the default port if there's one otherwise 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
	if (err) console.error("Error happens!")
	//console.log(`It's working... "https://127.0.0.1:${PORT}`)
})