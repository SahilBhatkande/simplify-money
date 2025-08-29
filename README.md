<img width="1916" height="948" alt="Screenshot 2025-08-29 134939" src="https://github.com/user-attachments/assets/31beb81e-33ed-408c-bf63-8216d98859ef" /># Precious Metals App

A React Native + Expo app that shows live prices for Gold, Silver, Platinum, and Palladium with a clean, scrollable UI and a detailed info screen for each metal.

Demo : 
<img width="1916" height="948" alt="Screenshot 2025-08-29 134939" src="https://github.com/user-attachments/assets/47dfd1b1-1022-4139-8882-a0d73ca2cd9e" />
<img width="1903" height="933" alt="Screenshot 2025-08-29 134958" src="https://github.com/user-attachments/assets/37e33bc7-f1fa-4c10-bbbc-919e85ff7bd1" />
<img width="1906" height="910" alt="Screenshot 2025-08-29 135012" src="https://github.com/user-attachments/assets/4af5e80d-98a3-42d6-985a-21ec639baf0e" />



## Quick Start

1. Install dependencies
```bash
cd PreciousMetalsApp
npm install
```

2. Start the app (Expo)
```bash
npm start
```
- Press `w` for web, `a` for Android emulator, `i` for iOS simulator, or scan the QR with Expo Go.

3. Common scripts
```bash
npm run android
npm run ios
npm run web
```

## APIs Used

- Primary endpoint (intended for production mobile): `https://api.metals.live/v1`
  - Example: `/spot/gold`, `/spot/silver`, `/spot/platinum`, `/spot/palladium`
- For development on web, API calls can be blocked by CORS. The app includes realistic fallback data with slight randomization, so the UI always works without keys.
- Alternative reference (not required, optional): `https://api.coingecko.com/api/v3`

Notes:
- Mobile builds (Android/iOS) are not affected by browser CORS and can call the API directly.
- The app currently defaults to fallback data during web development to avoid CORS issues.

## Configuration

No API keys are required. If you want to force real API calls on mobile only, adjust logic in `src/services/api.ts` to skip fallback when running on native.

## Features

- Metals covered: Gold, Silver, Platinum, Palladium
- 24 Karat (99.9% purity) context displayed
- Individual loaders per metal card
- Pull-to-refresh on the dashboard
- Details page with: previous open/close, 24h high/low, volume, timestamp, market cap, description
- Modern, scrollable UI with gradients

## Project Structure

```
src/
├── components/
│   └── MetalCard.tsx
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   ├── HomeScreen.tsx
│   └── MetalDetailsScreen.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

## Troubleshooting

- Web shows CORS errors: expected. Fallback data will be used. To test real API calls, use Android/iOS.
- Not scrollable dashboard: ensure you run the latest code; header is inside a `ScrollView` with `contentContainerStyle` padding.
- Metro bundler stuck: stop all Metro/Expo instances and re-run `npm start`.

## Tech Stack

- React Native, Expo, TypeScript
- React Navigation
- Axios
- expo-linear-gradient

## License

MIT

