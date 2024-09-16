import axios from 'axios';
const { getChatGptResponse } = require('./services/chatgptService');
const { getCoordinates } = require('./services/geocodingService');
const { generateImage } = require('./services/dalleService');

const MAIN_PROMPT = `You are "Journey Genie," the friendly, lively, and humorous tour guide AI for the Journey Genie app. Your goal is to make every travel experience fun and engaging by providing informative yet entertaining descriptions of various places. Your tone is always warm and inviting, with a dash of wit and humor to keep things lighthearted. When answering questions, you add a bit of personality—think of yourself as the travel guide who always has a funny anecdote, a clever remark, or a fun fact up your sleeve.

When describing places or answering questions, imagine you're speaking directly to travelers who are excited to explore new destinations. You want to make them smile, laugh, and feel as though they’re on an adventure with a knowledgeable yet playful guide. Your responses should be conversational and feel like a chat between friends.

Here’s an example of how you might introduce a famous landmark:

"Welcome to the Eiffel Tower, folks! Standing tall at over 1,000 feet, this iron giant is like the Beyoncé of Paris—iconic, breathtaking, and the star of countless selfies. Built in 1889, it was originally meant to be temporary, but Parisians loved it so much that it’s still here today, showing off its glittering lights every evening. Fun fact: It’s repainted every seven years to keep it looking fabulous—talk about high maintenance!"

When answering questions, continue this friendly and lively tone. For example:

Traveler’s Question: "Why is the Statue of Liberty green?"

Journey Genie's Response: "Ah, Lady Liberty! She wasn’t always green, you know. When she first arrived from France, she was a shiny copper color—like a giant penny! But over time, the copper reacted with the air and water, giving her that beautiful green patina. It’s like a natural makeover, and now she’s rocking that green gown like a true New Yorker!"

Now, based on this persona, please provide descriptions or answers with the same energy and style.. `;

const TOUR_PROMPT = `Please provide a list of places with detailed descriptions. The description should sound like a tour guide is talking and giving spotting instructions as well. Format each entry as follows. We will use the entries in random order so dont say things like "finally lets go to this spot" etc. Dont even add numbering to suggest any order. Dont add extra empty lines between each entry:
      Sample: John's of Bleecker Street:  We wend our way to Bleecker and Jones. Here we find John's of Bleecker Street, a pizzeria that's been slinging New York’s famous thin crust pies since 1929. The tables are carved with the initials of decades' worth of satisfied customers, so don’t forget to leave your mark too. It's a savory chapter in Bleecker Street's delectable dining history!`

const QNA_PROMPT = MAIN_PROMPT;
async function generateTour(description, params) {
  let location = params.location;
  let mainPrompt = MAIN_PROMPT;
  let tourPrompt = TOUR_PROMPT;
  try {
    const prompts = await axios({ method: 'get', url: `https://madhavanmalolan.xyz/apps/journey-genie/prompts?timestamp=${Date.now()}`});
    mainPrompt = prompts.data.main;
    tourPrompt = prompts.data.tour;
  } catch (error) {
  }

  try {
    // Step 1: Get a creative title
    const titlePrompt = `
      Create a catchy and creative title for a tour with the following description: "${description}"
    `;
    const titleResponse = await getChatGptResponse(titlePrompt);
    const tourTitle = titleResponse.trim();

    // Step 2: Get the list of places and detailed descriptions
    const placesPrompt = `
      ${mainPrompt} and Create a tour based on the following description: "${description}"
      ${tourPrompt}
      Start your list below:    
      `;
    const placesResponse = await getChatGptResponse(placesPrompt);
    
    // Parse the places response into 
    //console.log(placesResponse)
    const chatGptItems = placesResponse.split('\n').map(line => {
      const parts = line.split(':');
      if (parts.length < 2) {
        return null;
      }
      return {
        name: parts[0].trim().trim('"'),
        description: parts.slice(1).join(':').trim().trim('"'),
      };
    }).filter(item => item !== null);

    // Step 3: Generate an image for the tour
    const tourImageUrl = await generateImage(location);

    // Step 4: Process each item to get coordinates
    const tourItems = await Promise.all(
      chatGptItems.map(async (item) => {
        const coordinates = await getCoordinates(`${item.name}, ${location}`);
        return {
          name: item.name,
          description: item.description,
          coordinates,
        };
      })
    );

    // Filter out items without coordinates
    const filteredTourItems = tourItems.filter(item => item.coordinates !== null);

    // Structure the final tour object
    const tour = {
      title: tourTitle,
      imageUrl: tourImageUrl,
      items: filteredTourItems,
    };

    return tour;
  } catch (error) {
    throw new Error('Failed to generate tour');
  }
}

async function getMoreDetails(originalDescription, latestQuestion, previousQAArray) {
  let qnaPrompt = QNA_PROMPT;
  try {
    console.log("Getting prompts");
    const prompts = await axios({ method: 'get', url: `https://madhavanmalolan.xyz/apps/journey-genie/prompts?timestamp=${Date.now()}`});
    qnaPrompt = prompts.data.qna;
    console.log("Got prompts");
  } catch (error) {
    console.log("Error getting prompts", error);
  }

  console.log("QNA Prompt", qnaPrompt); 

  if(latestQuestion.length < 5)
    return ""
  
  // Form the base of the prompt with the original description
  let prompt = `${qnaPrompt} Here is the original description of a place:\n"${originalDescription}"\n\n`;

    // If there are previous Q&As, add them to the prompt
    if (previousQAArray && previousQAArray.length > 0) {
      prompt += `Here are the previous questions and answers related to this description:\n`;
      previousQAArray.forEach((qa, index) => {
          prompt += `Q${index + 1}: ${qa.question}\nA${index + 1}: ${qa.answer}\n\n`;
      });
  }

  // Add the latest question to the prompt
  prompt += `Now, here is the latest question:\n"${latestQuestion}"\n\n`;

  // Add final instructions for ChatGPT
  prompt += `Please provide an answer to the latest question, ensuring it aligns with the original description and the previous questions and answers. Make sure your response is informative and keeps the tone and style of a friendly and engaging travel guide. Dont start with something like "Journey Genie's response' just respond directly with the response`;
  const placesResponse = await getChatGptResponse(prompt);
  return placesResponse;
}

module.exports = {
  generateTour,
  getMoreDetails,
};
