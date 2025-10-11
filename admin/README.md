# Bus Tracking System - Admin Panel

Admin panel for managing buses, drivers, trips, and system analytics in the Bus Tracking System.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Bus/admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

## 🔧 Environment Configuration

Create a `.env` file in the admin directory with the following variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
VITE_CLOUDINARY_PRESET=your_upload_preset

# Backend API Configuration
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLOUDINARY_URL` | Cloudinary upload endpoint | `https://api.cloudinary.com/v1_1/drx3wkg1h/image/upload` |
| `VITE_CLOUDINARY_PRESET` | Cloudinary upload preset | `BusTrac` |
| `VITE_API_BASE_URL` | Backend API base URL | `https://bustrac-backend.onrender.com` |

## 🎯 Features

- **Dashboard**: System overview and analytics
- **Bus Management**: Add, edit, delete buses with image upload
- **Driver Management**: Manage driver profiles and assignments
- **Trip Management**: Monitor active trips and history
- **Authentication**: Secure admin login with JWT tokens
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on all device sizes

## 🔐 Default Admin Credentials

```
Email: deepumelkani123@gmail.com
Password: hack77
```

⚠️ **Important**: Change the default password after first login!

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
admin/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── App.jsx         # Main app component
├── .env                # Environment variables
├── .env.example        # Environment template
└── README.md           # This file
```

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Netlify/Vercel

1. Build the project
2. Upload the `dist/` folder to your hosting provider
3. Set environment variables in your hosting dashboard

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Ensure you're logged in as admin
   - Check if backend is running
   - Verify API_BASE_URL in .env

2. **Image Upload Fails**
   - Check Cloudinary credentials
   - Verify upload preset permissions
   - Ensure CORS is properly configured

3. **Page Refresh Loses Authentication**
   - Clear browser cache
   - Check localStorage for adminToken
   - Verify JWT token hasn't expired

## 📱 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **Image Upload**: Cloudinary
- **Icons**: Lucide React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Bus Tracking System.
