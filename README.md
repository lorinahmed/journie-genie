# Journey Genie 🧞‍♂️

A React Native mobile application that creates interactive, location-based audio tours using AI-powered narration and real-time location tracking.

## 🌟 Features

- **Interactive Maps**: Real-time location tracking with Google Maps integration
- **AI-Powered Narration**: Dynamic audio descriptions using Google Text-to-Speech
- **Voice Interaction**: Ask follow-up questions using voice commands and speech recognition
- **Location-Based Triggers**: Automatic audio playback when approaching points of interest
- **Offline Capability**: Works with pre-loaded tour data
- **Cross-Platform**: Built with React Native for iOS and Android

## 🏗️ Architecture

The app consists of several key components:

- **Map Interface**: Real-time location tracking and point-of-interest markers
- **Audio Engine**: Text-to-speech synthesis and voice recording
- **AI Integration**: OpenAI-powered conversational responses
- **Location Services**: GPS tracking and proximity detection
- **Data Management**: AsyncStorage for local tour data persistence

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lorinahmed/journie-genie.git
   cd journie-genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
   ```

   Or update `intelligence/config.js` with your API keys:
   ```javascript
   module.exports = {
     openaiApiKey: "your_openai_api_key_here",
     googleMapsApiKey: "your_google_maps_api_key_here",
     openaiApiUrl: 'https://api.openai.com/v1/chat/completions',
     dalleApiUrl: 'https://api.openai.com/v1/images/generations',
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 📱 Building for Production

### Android APK

```bash
npx eas build --platform android --profile preview
```

### iOS App Store

```bash
npx eas build --platform ios --profile production
```

## 🎯 How It Works

### 1. Tour Creation
- Tours are created as JSON data with location coordinates and descriptions
- Each tour contains multiple points of interest with:
  - Name and description
  - GPS coordinates (latitude/longitude)
  - Audio narration content

### 2. Location Tracking
- Uses Expo Location for real-time GPS tracking
- Continuously monitors user position
- Calculates distance to nearby points of interest using Haversine formula

### 3. Audio Playback
- Automatically triggers when user approaches a point of interest (within 25 meters)
- Uses Google Text-to-Speech API for natural-sounding narration
- Prevents duplicate playback of the same location

### 4. Voice Interaction
- Tap and hold the microphone button to ask follow-up questions
- Uses Google Speech-to-Text for voice recognition
- Integrates with OpenAI for intelligent responses
- Maintains conversation context for contextual answers

### 5. Map Interface
- Google Maps integration with custom markers
- Real-time user location with radius indicator
- Interactive markers that trigger audio playback on tap

## 🛠️ Technical Stack

- **Frontend**: React Native with Expo
- **Maps**: React Native Maps with Google Maps
- **Location**: Expo Location
- **Audio**: Expo AV for playback and recording
- **AI**: OpenAI GPT for conversational responses
- **Speech**: Google Text-to-Speech and Speech-to-Text
- **Storage**: AsyncStorage for local data persistence
- **Build**: EAS Build for cross-platform compilation

## 📁 Project Structure

```
journey-genie/
├── assets/                 # Images and static assets
├── intelligence/           # AI integration and config
├── screens/               # React Native screen components
│   └── map/              # Main map interface
├── theme/                 # UI theme and styling
├── android/              # Android-specific configuration
├── ios/                  # iOS-specific configuration
├── App.js                # Main application component
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### API Keys Required

1. **OpenAI API Key**: For conversational AI responses
2. **Google Maps API Key**: For map functionality and location services
3. **Google Cloud API Key**: For text-to-speech and speech-to-text

### Environment Variables

The app supports both `.env` files and direct configuration in `intelligence/config.js`. Make sure to never commit actual API keys to version control.

## 🎨 Customization

### Adding New Tours

1. Create a JSON file with tour data:
```json
{
  "name": "Tour Name",
  "description": "Tour description",
  "items": [
    {
      "name": "Point of Interest",
      "description": "Audio narration content",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  ]
}
```

2. Store the tour data using AsyncStorage
3. Pass the tour key to the MapScreen component

### Styling

The app uses a theme system located in `theme/index.json`. Modify colors, fonts, and styling to match your brand.

## 🚨 Troubleshooting

### Common Issues

1. **Location permissions denied**
   - Ensure location permissions are granted in device settings
   - Check that the app has proper permission requests

2. **Audio not playing**
   - Verify Google Cloud API key is valid
   - Check device volume and audio settings
   - Ensure internet connectivity for API calls

3. **Map not loading**
   - Verify Google Maps API key is valid
   - Check internet connectivity
   - Ensure API key has Maps SDK enabled

4. **Voice recognition not working**
   - Check microphone permissions
   - Verify Google Cloud Speech-to-Text API is enabled
   - Ensure proper audio format settings

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This app requires active internet connectivity for AI features and map functionality. Some features may be limited in offline mode. 