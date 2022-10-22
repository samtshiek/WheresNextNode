const express = require('express');
const app = express(); 
// CORS
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// router
const indexRouter = require('./routes/index')

app.use('/', indexRouter);

// It'll use a default port if there's one otherwise 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
	if (err) console.error("Error happens!")
	console.log(`It's working... "http://127.0.0.1:${PORT}`)
})