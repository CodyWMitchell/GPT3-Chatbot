const { getPersonalities, postChat } = require('./controllers');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the EveryBotty Chatbot API!');
});

router.get('/api/personalities', getPersonalities);
router.post('/api/chat', postChat);

module.exports = router;