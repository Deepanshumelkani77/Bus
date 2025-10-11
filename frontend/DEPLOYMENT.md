# Frontend Deployment Guide

## 🚀 Deployment Platforms

### **Netlify (Recommended)**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. The `_redirects` file will handle SPA routing automatically

### **Vercel**
1. Connect your GitHub repository
2. Vercel will auto-detect Vite settings
3. The `vercel.json` file will handle SPA routing

### **Render**
1. Create a new Static Site
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. The `serve.json` file will handle SPA routing

### **Manual Deployment**
```bash
# Build the project
npm run build

# The dist/ folder contains your built app
# Upload the contents of dist/ to your hosting provider
```

## 🔧 Environment Variables

For production deployment, set these environment variables in your hosting platform:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## 🐛 Common Issues

### **404 on Page Refresh**
- **Problem**: Routes like `/live-tracking/123` return 404
- **Solution**: SPA routing configuration files are included
- **Files**: `_redirects`, `vercel.json`, `serve.json`

### **API Calls Failing**
- **Problem**: API calls to localhost in production
- **Solution**: Update API base URL to production backend URL

### **Socket.io Connection Issues**
- **Problem**: WebSocket connections failing
- **Solution**: Ensure backend supports CORS for your frontend domain

## ✅ Deployment Checklist

- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variables set
- [ ] SPA routing configured
- [ ] API URLs point to production backend
- [ ] CORS configured on backend
- [ ] Test all routes after deployment
