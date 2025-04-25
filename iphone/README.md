# ICBC Study Hub - iOS App

This directory contains the iOS version of the ICBC Study Hub application, built with React Native.

## Prerequisites

- macOS computer with Xcode 14.0 or later
- Node.js 16.0 or later
- CocoaPods
- Apple Developer Account ($99/year subscription)
- Ruby (for CocoaPods)

## Setup Instructions

1. Install dependencies:
```bash
# Install Node.js dependencies
npm install

# Install CocoaPods
cd ios
pod install
cd ..
```

2. Open the Xcode workspace:
```bash
open ios/ICBCStudyHub.xcworkspace
```

3. In Xcode:
   - Sign in with your Apple ID
   - Configure your development team
   - Set up your Bundle Identifier
   - Configure signing certificates

## Development

1. Start the Metro bundler:
```bash
npm start
```

2. Run the app in simulator:
```bash
npm run ios
```

## App Store Submission Checklist

1. App Store Connect Setup:
   - Create a new app in App Store Connect
   - Configure app information
   - Set up app privacy details
   - Create required screenshots

2. App Assets:
   - App Icon (All required sizes)
   - Launch Screen
   - Screenshots for different device sizes
   - App Preview video (optional)

3. Required Information:
   - App name
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
   - Marketing URL (optional)
   - Version number
   - Build number

4. Build and Submit:
   - Set up release configuration in Xcode
   - Archive the app
   - Upload to App Store Connect
   - Submit for review

## Testing

1. Run tests:
```bash
npm test
```

2. TestFlight:
   - Upload build to TestFlight
   - Add internal testers
   - Distribute to external testers

## Troubleshooting

Common issues and solutions:

1. Pod install fails:
```bash
cd ios
pod deintegrate
pod install
```

2. Build errors:
```bash
# Clean build folder
cd ios
xcodebuild clean
```

3. Metro bundler issues:
```bash
# Clear Metro cache
npm start -- --reset-cache
```

## App Store Guidelines

Ensure your app complies with:
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Developer Program License Agreement](https://developer.apple.com/terms/)
- [App Store Guidelines for ICBC-related apps](https://developer.apple.com/app-store/review/guidelines/#government) 