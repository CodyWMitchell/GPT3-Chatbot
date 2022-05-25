require('dotenv').config();
const routes = require("./api/routes");
const rateLimit = require('express-rate-limit');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(rateLimit({ // Limit to 30 requests per minute
    windowMs: 6000,
    max: 30,
    message: {
        response: "Too many requests. Please try again later."
    }
}));

app.use(routes);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});