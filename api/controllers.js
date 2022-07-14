const { personalities } = require('../personalities');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const contentFilter = async (response) => {
    prompt = `<|endoftext|>${response}\n--\nLabel:`
    const res = await openai.createCompletion("content-filter-alpha", {
        prompt,
        temperature: 0,
        max_tokens: 1,
        top_p: 0,
        logprobs: 10
    })
    return res.data.choices[0].text;
}

// GET /api/personalities
const getPersonalities = (req, res) => {
    res.json(personalities.map(
        p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            slack_config: p.slack_config
        })
    ));
    return;
}

// POST /api/chat
const postChat = (req, res) => {
    if (req.headers.authorization !== process.env.AUTH_TOKEN) {
        res.status(401).send('Unauthorized');
        return;
    }

    const prompt = req.query.prompt;
    if (!prompt) {
        res.status(400).send('Missing prompt parameter');
        return;
    }

    const personality = personalities.find(p => p.id === req.query.personality);
    if (!personality) {
        res.status(400).send('Invalid personality');
        return;
    }

    openai.createCompletion(
        "text-davinci-002",
        {
            prompt: personality.prePrompt + prompt + personality.postPrompt,
            ...personality.aiParams
        }
    ).then(async (response) => {
        let responseText = response.data.choices[0].text;
        responseText = responseText.replace(/^\n+/, '');

        // check if the user sent noFilter: true
        if (!req.query.noFilter) {
            const contentLabel = await contentFilter(responseText);
            if (contentLabel === '2') {
                responseText = '[REDACTED]';
            }
        }

        res.json({
            response: responseText
        });
        return;
    });
}

module.exports = {
    getPersonalities,
    postChat
}