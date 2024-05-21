const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(configuration);

app.post('/api/suggestions', async (req, res) => {
    const { sentence } = req.body;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Provide rephrasing suggestions for the following sentence: "${sentence}"`,
            max_tokens: 100,
        });

        const suggestions = response.data.choices[0].text.trim().split('\n').map(s => s.trim()).filter(Boolean);
        res.json({ original: sentence, suggestions });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
