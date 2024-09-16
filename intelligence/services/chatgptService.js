import axios from 'axios';
const config = require('../config');

async function getChatGptResponse(prompt) {
  console.log('Prompt:', prompt); // Log the prompt
  try {
    const response = await axios.post(
      config.openaiApiUrl,
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Ensure you correctly access the message content
    const chatGptContent = response.data.choices[0].message.content;
  //  console.log('ChatGPT Response Content:', chatGptContent); // Log the response content

    return chatGptContent; // Return the content as a string
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    throw new Error('Failed to fetch ChatGPT response');
  }
}

module.exports = {
  getChatGptResponse,
};
