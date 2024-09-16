import axios from 'axios';
const config = require('../config');

async function generateImage(location) {
  const prompt = `Create a photograph of ${location}`;
  try {
    const response = await axios.post(
      config.dalleApiUrl,
      {
        prompt,
        n: 1,
        size: '256x256', // You can adjust size as needed
      },
      {
        headers: {
          Authorization: `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].url; // Assuming the response contains a URL
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

module.exports = {
  generateImage,
};
