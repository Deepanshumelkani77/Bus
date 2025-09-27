# Bus Tracking System

A comprehensive real-time bus tracking system with three main components: Frontend (React), Backend (Node.js), and DriverApp (React Native).

## 🚀 Features

### Frontend (React Web App)
- **Trip Search**: Search buses by source and destination
- **Real-time Tracking**: Live GPS tracking with Google Maps integration
- **Modern UI**: Glassmorphism design with TailwindCSS
- **WebSocket Integration**: Real-time location updates
- **User Authentication**: Secure login/signup system

### Backend (Node.js API)
- **Trip Management**: Create, start, complete trips
- **Real-time Location**: GPS tracking with location history
- **Search API**: Find trips by source/destination
- **WebSocket Support**: Socket.IO for real-time updates
- **Authentication**: JWT-based auth for users and drivers

### DriverApp (React Native)
- **Mobile Interface**: Native app for bus drivers
- **GPS Tracking**: Real-time location sharing
- **Trip Management**: Start/stop trips, update status

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, Socket.IO Client
- **Backend**: Node.js, Express, MongoDB, Socket.IO, JWT
- **Mobile**: React Native, Expo Router
- **Maps**: Google Maps API
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Maps API key
- Expo CLI (for mobile app)

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=2000
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=http://localhost:2000
```

Start the development server:
```bash
npm run dev
```

### 3. DriverApp Setup

```bash
cd DriverApp
npm install
```

Start Expo:
```bash
npx expo start
```

## 🗺 API Endpoints

### Trip Management
- `GET /trips/search?src=SOURCE&des=DESTINATION` - Search trips
- `GET /trips/:id` - Get trip details
- `GET /trips/:tripId/location` - Get current location
- `POST /trips/location` - Update trip location
- `POST /trips/create` - Create new trip
- `PATCH /trips/:tripId/start` - Start trip
- `PATCH /trips/:tripId/complete` - Complete trip

### Authentication
- `POST /user-auth/signup` - User registration
- `POST /user-auth/login` - User login
- `GET /user-auth/profile` - Get user profile
- `POST /auth/login` - Driver login

## 🎯 Usage Flow

### For Passengers:

1. **Search Trips**
   - Open the web app at `http://localhost:5173`
   - Navigate to Track page
   - Enter source and destination
   - Click "Search Buses"

2. **View Available Buses**
   - See list of ongoing trips
   - View bus details, driver info, available seats
   - Check estimated arrival times

3. **Live Tracking**
   - Click "Track Live" on any bus
   - View real-time location on Google Maps
   - See trip status, speed, and ETA
   - Contact driver if needed

### For Drivers:

1. **Mobile App**
   - Install and open the DriverApp
   - Login with driver credentials
   - Start a new trip

2. **Location Sharing**
   - App automatically shares GPS location
   - Real-time updates sent to backend
   - Passengers can track the bus live

## 🔄 Real-time Features

### WebSocket Events
- `join-trip` - Join trip room for updates
- `leave-trip` - Leave trip room
- `location-update` - Receive real-time location updates

### Location Updates
- Updates every 3 seconds from driver app
- Automatic WebSocket broadcasting to passengers
- Location history stored (last 100 points)

## 🎨 UI Components

### Track.jsx Features
- **Search Form**: Source/destination input with validation
- **Trip Cards**: Beautiful cards showing bus information
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all screen sizes

### LiveTracking.jsx Features
- **Google Maps Integration**: Real-time map with custom markers
- **Trip Information Panel**: Detailed trip and driver info
- **Real-time Updates**: Live location updates via WebSocket
- **Contact Driver**: Direct call functionality
- **Seat Availability**: Visual seat occupancy indicator

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Role-based access control (user vs driver)
- Input validation and sanitization
- CORS configuration
- Protected routes

## 📱 Mobile Features

- Native GPS tracking
- Offline capability
- Push notifications
- Touch-friendly interface
- Real-time location sharing

## 🚦 Trip Status Flow

1. **Pending** - Trip created, not started
2. **Ongoing** - Trip in progress, location tracking active
3. **Completed** - Trip finished

## 🗄 Database Schema

### Trip Model
```javascript
{
  bus: ObjectId,
  driver: ObjectId,
  source: String,
  destination: String,
  route: [{ lat: Number, lng: Number }],
  startTime: Date,
  endTime: Date,
  totalSeats: Number,
  occupiedSeats: Number,
  status: 'Pending' | 'Ongoing' | 'Completed',
  currentLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Number,
    speed: Number,
    heading: Number
  },
  locationHistory: [LocationSchema]
}
```

## 🔧 Configuration

### Google Maps Setup
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add key to frontend `.env` file
4. Configure API restrictions as needed

### MongoDB Setup
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to backend `.env` file
4. Configure network access

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Deploy to Netlify, Vercel, or similar

### Backend
- Deploy to Heroku, Railway, or similar
- Set environment variables
- Configure MongoDB connection

### Mobile App
- Build with Expo: `expo build`
- Deploy to App Store/Play Store

## 🐛 Troubleshooting

### Common Issues
1. **Google Maps not loading**: Check API key and billing
2. **WebSocket connection failed**: Verify backend URL and CORS
3. **Location not updating**: Check GPS permissions and network
4. **Database connection error**: Verify MongoDB URI and network access

### Debug Mode
- Enable console logging in development
- Check network tab for API calls
- Monitor WebSocket connections
- Use React DevTools for state debugging

## 📈 Performance Optimization

- Location history limited to 100 points
- Efficient WebSocket room management
- Optimized database queries with population
- Lazy loading for map components
- Debounced search inputs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check troubleshooting section
- Review API documentation
- Contact development team

---

**Built with ❤️ for efficient public transportation**
