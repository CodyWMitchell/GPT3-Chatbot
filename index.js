require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { personalities } = require('./personalities');
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

app.use('/api/chat',(req, res, next) => {
    if (req.headers.authorization !== process.env.AUTH_TOKEN) {
        res.status(401).send('Unauthorized');
        return;
    }
    next();
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
    engineId: ""
});

const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) {
        res.status(400).send('Missing prompt parameter');
        return;
    }

    const personalityId = req.query.personality;
    if (!personalityId || !personalities.find(p => p.id === personalityId)) {
        res.status(400).send('Invalid personality');
        return;
    }
    personality = personalities.find(p => p.id === personalityId);

    openai.createCompletion(
        "text-davinci-002",
        {
            prompt: personality.prePrompt + prompt + personality.postPrompt,
            ...personality.aiParams
        }
    ).then(response => {
        responseText = response.data.choices[0].text;
        responseText = responseText.replace(/^\n+/, '');

        res.json({
            response: responseText
        });
    });
});

app.get('/api/personalities', (req, res) => {
    // return a list of the personalities with id, name, and description for each
    res.json(personalities.map(
        p => ({
            id: p.id,
            name: p.name,
            description: p.description
        })
    ));
});

app.get('/', (req, res) => {
    res.send('Welcome to the GPT3 Chatbot API!');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});