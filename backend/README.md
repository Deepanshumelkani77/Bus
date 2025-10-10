# 🚌 Bus Tracking System - Backend API

A comprehensive Node.js/Express backend for a real-time bus tracking system with smart trip matching, GPS tracking, and multi-role authentication.

## 🌟 Features

### 🔐 **Multi-Role Authentication System**
- **User Authentication**: Passenger registration and login
- **Driver Authentication**: Driver registration and profile management
- **Admin Authentication**: Administrative access with role-based permissions
- **JWT Token Security**: 7-day expiration with secure secret management

### 🗺️ **Smart Trip Matching**
- **Real-time Trip Search**: Intelligent matching of user requests with driver routes
- **Google Maps Integration**: Places autocomplete, directions, and geocoding
- **Route Compatibility**: Advanced algorithm to match pickup/drop points with bus routes
- **ETA Calculations**: Traffic-aware arrival time predictions

### 📍 **Real-time GPS Tracking**
- **Live Location Updates**: Socket.io for real-time driver location broadcasting
- **Location History**: Stores and manages location data for trips
- **Bus Status Tracking**: Real-time bus availability and assignment

### 🚌 **Bus Management**
- **Bus Registration**: Complete bus information management
- **Driver Assignment**: Flexible bus-to-driver assignment system
- **City-based Filtering**: Location-based bus discovery
- **Status Management**: Active/inactive bus status tracking

### 🛣️ **Trip Management**
- **Trip Creation**: Drivers can create trips with source and destination
- **Trip Tracking**: Real-time trip status and location updates
- **Trip History**: Complete trip records and analytics
- **Status Management**: Pending → Ongoing → Completed workflow

## 🏗️ Architecture

### **Technology Stack**
- **Runtime**: Node.js 16+
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs hashing
- **Real-time**: Socket.io 4.7.5
- **Maps**: Google Maps APIs (Places, Directions, Geocoding)
- **Environment**: dotenv for configuration management

### **Database Models**
- **User**: Passenger profiles and preferences
- **Driver**: Driver information and active bus assignments
- **Admin**: Administrative users with role-based permissions
- **Bus**: Bus information, capacity, and status
- **Trip**: Trip details with real-time location data
- **Route**: Predefined bus routes (future enhancement)

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ and npm 8+
- MongoDB database (local or Atlas)
- Google Maps API key

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd Bus/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### **Environment Configuration**
```bash
# Required Environment Variables
NODE_ENV=production
PORT=2000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_API_KEY=your_google_maps_api_key
```

## 📡 API Endpoints

### **Authentication Endpoints**

#### **User Authentication** (`/user-auth`)
- `POST /user-auth/signup` - User registration
- `POST /user-auth/login` - User login
- `GET /user-auth/profile` - Get user profile (protected)
- `PUT /user-auth/profile` - Update user profile (protected)

#### **Driver Authentication** (`/auth`)
- `POST /auth/signup` - Driver registration
- `POST /auth/login` - Driver login
- `GET /auth/profile` - Get driver profile (protected)
- `PUT /auth/profile` - Update driver profile (protected)

#### **Admin Authentication** (`/admin-auth`)
- `POST /admin-auth/login` - Admin login
- `GET /admin-auth/profile` - Get admin profile (protected)
- `PUT /admin-auth/profile` - Update admin profile (protected)

### **Bus Management** (`/buses`)
- `GET /buses` - List all buses (with city filtering)
- `GET /buses/cities` - Get list of cities
- `POST /buses/assign` - Assign bus to driver
- `POST /buses` - Create new bus (admin only)
- `PUT /buses/:id` - Update bus (admin only)
- `DELETE /buses/:id` - Delete bus (admin only)

### **Trip Management** (`/trips`)
- `POST /trips/create` - Create new trip
- `GET /trips/active` - Get active trips
- `GET /trips/:tripId/location` - Get trip location
- `PUT /trips/:tripId/location` - Update trip location
- `PUT /trips/:tripId/status` - Update trip status

### **Smart Trip Search** (`/smart-trips`)
- `POST /smart-trips/search` - Search for matching trips
- `GET /smart-trips/:tripId/eta` - Get ETA for specific trip

### **Google Maps Integration** (`/google`)
- `GET /google/autocomplete` - Places autocomplete
- `GET /google/place-details` - Get place details
- `GET /google/directions` - Get directions between points

### **Driver Management** (`/drivers`)
- `GET /drivers` - List drivers (admin only)
- `GET /drivers/cities` - Get driver cities
- `POST /drivers` - Create driver (admin only)
- `PUT /drivers/:id` - Update driver (admin only)
- `DELETE /drivers/:id` - Delete driver (admin only)

## 🔧 Development

### **Available Scripts**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run API tests
npm run seed-admin # Create initial admin user
npm run seed-data  # Seed sample data
npm run health-check # Check server health
```

### **Testing**
```bash
# Run comprehensive API tests
npm test

# Test specific endpoints
curl http://localhost:2000/health
curl http://localhost:2000/buses/cities
```

### **Database Seeding**
```bash
# Create initial admin user
npm run seed-admin

# Add sample buses and data
npm run seed-data
```

## 🌐 Deployment

### **Environment Setup**
1. Copy `.env.example` to `.env`
2. Configure all required environment variables
3. Ensure MongoDB connection is accessible
4. Verify Google Maps API key has proper permissions

### **Deployment Platforms**
- **Heroku**: `git push heroku main`
- **Railway**: `railway up`
- **Render**: Connect GitHub repository
- **DigitalOcean**: Use App Platform
- **AWS EC2**: Use PM2 for process management

See `deploy.md` for detailed deployment instructions.

## 🔒 Security Features

### **Authentication Security**
- JWT tokens with configurable expiration
- Password hashing with bcryptjs
- Role-based access control
- Secure session management

### **API Security**
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting (configurable)
- Environment-based configuration

### **Database Security**
- MongoDB connection with authentication
- Secure connection strings
- Data validation with Mongoose schemas

## 📊 Real-time Features

### **Socket.io Integration**
- Real-time driver location updates
- Live trip status broadcasting
- User connection management
- Event-based communication

### **Location Tracking**
- High-frequency GPS updates
- Location history storage
- Geospatial queries for proximity
- Real-time ETA calculations

## 🛠️ Configuration

### **Environment Variables**
| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `PORT` | Server port | Yes |
| `MONGO_URI` | MongoDB connection | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `GOOGLE_API_KEY` | Google Maps API key | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | No |
| `API_BASE_URL` | Base API URL | No |

### **Google Maps API Setup**
1. Enable required APIs:
   - Places API
   - Directions API
   - Geocoding API
2. Set up API key restrictions
3. Configure billing (required for production)

## 📈 Monitoring & Logging

### **Health Monitoring**
- `/health` endpoint for uptime checks
- Environment variable validation
- Database connection status
- API key configuration verification

### **Logging**
- Structured console logging
- Error tracking and reporting
- Request/response logging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section in `deploy.md`
2. Review the API documentation
3. Check environment variable configuration
4. Verify database and API key setup

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - Multi-role authentication
  - Smart trip matching
  - Real-time GPS tracking
  - Google Maps integration
  - Bus and driver management
