const { generateTour } = require('./intelligence');

const testGenerateTour = async () => {
    const response = await generateTour('I want to have a walking tour of San Francisco and I have 3 hours. I would like to learn about the history of the city.', { location: 'San Francisco', duration: 3, interest: 'history', type: 'walking' });
    console.log(response);    
};

testGenerateTour();
