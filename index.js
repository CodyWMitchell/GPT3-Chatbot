require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { personalities } = require('./personalities');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
    engineId: ""
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
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

app.get('/', (req, res) => {
    res.send('Welcome to the GPT3 Chatbot API!');
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})