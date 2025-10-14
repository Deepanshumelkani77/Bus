# 📱 BusTrac DriverApp Deployment Guide

## 🚀 Deployment Options

### Option 1: EAS Build & Deploy (Recommended)

#### Prerequisites
1. Install EAS CLI globally:
```bash
npm install -g @expo/eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

#### Step 1: Configure for Production
Update your `app.json` with production settings:

```json
{
  "expo": {
    "name": "BusTrac Driver",
    "slug": "bustrac-driver",
    "version": "1.0.0",
    "android": {
      "package": "com.bustrac.driver",
      "versionCode": 1
    },
    "ios": {
      "bundleIdentifier": "com.bustrac.driver",
      "buildNumber": "1"
    }
  }
}
```

#### Step 2: Build for Android (APK/AAB)
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

#### Step 3: Build for iOS (IPA)
```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production
```

#### Step 4: Submit to App Stores
```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

### Option 2: Expo Go (Development/Testing)

#### Publish to Expo Go
```bash
# Install Expo CLI
npm install -g @expo/cli

# Publish update
expo publish
```

Users can then scan QR code with Expo Go app to test your app.

### Option 3: Web Deployment

#### Deploy as Web App
```bash
# Build for web
expo build:web

# Deploy to Netlify/Vercel
# Upload the web-build folder
```

## 🔧 Production Configuration

### Update API Configuration
Ensure your API URLs are set to production:
- `lib/api.ts`: ✅ Already set to `https://bustrac-backend.onrender.com`
- `lib/AuthContext.tsx`: ✅ Already set to production URL

### App Store Requirements

#### Android (Google Play Store)
1. **App Icon**: ✅ Already configured in `app.json`
2. **Splash Screen**: ✅ Already configured
3. **Permissions**: Location, Internet (already in use)
4. **Package Name**: Update to unique identifier
5. **Signing Key**: EAS handles automatically

#### iOS (Apple App Store)
1. **Bundle Identifier**: Must be unique
2. **App Icons**: ✅ Already configured
3. **Privacy Usage Descriptions**: Add location permissions
4. **Apple Developer Account**: Required ($99/year)

## 📋 Pre-Deployment Checklist

- [ ] Test app thoroughly on physical devices
- [ ] Verify all API endpoints work with production backend
- [ ] Update app version numbers
- [ ] Configure unique package names/bundle identifiers
- [ ] Test location permissions and GPS functionality
- [ ] Verify Google Maps integration works
- [ ] Test authentication flow
- [ ] Check app icons and splash screens

## 🎯 Quick Start Commands

### For Testing (APK)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build APK for testing
eas build --platform android --profile preview
```

### For Production (App Stores)
```bash
# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 📱 Distribution Options

1. **Direct APK**: Share APK file directly with drivers
2. **Google Play Store**: Professional distribution
3. **Apple App Store**: iOS users
4. **Expo Go**: Quick testing and demos
5. **Web Version**: Browser-based access

## 🔐 Security Notes

- All API calls use HTTPS
- JWT tokens for authentication
- Location data encrypted in transit
- No hardcoded secrets in app

## 📞 Support

Your BusTrac DriverApp is now ready for deployment! Choose the option that best fits your distribution needs.
