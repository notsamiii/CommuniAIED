const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    const { text, language } = req.body;

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://api.languagetool.org/v2/check',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: `text=${encodeURIComponent(text)}&language=${language}`
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

