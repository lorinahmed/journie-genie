import axios from 'axios';
const config = require('../config');

async function getCoordinates(placeName) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: placeName,
        key: config.googleMapsApiKey
      }
    });

    const location = response.data.results[0]?.geometry.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (error) {
    console.error(`Error fetching coordinates for ${placeName}:`, error);
    return null;
  }
}

module.exports = {
  getCoordinates,
};
