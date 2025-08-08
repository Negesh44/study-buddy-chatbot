const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful study buddy for high school students.' },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
