require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.GROQ_API_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
