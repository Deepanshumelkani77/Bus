# 🚀 Backend Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MONGO_URI` with your MongoDB connection string
- [ ] Set `JWT_SECRET` with a strong, random secret key
- [ ] Set `GOOGLE_API_KEY` with your Google Maps API key
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` for your frontend domains
- [ ] Set `DEPLOYMENT_URL` to your production domain

### ✅ Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Ensure Node.js version 16+ is installed
- [ ] Verify MongoDB connection is working

### ✅ Security
- [ ] JWT_SECRET is at least 32 characters long
- [ ] Google API key has proper restrictions
- [ ] CORS origins are properly configured
- [ ] Database credentials are secure

## 🌐 Deployment Platforms

### 1. **Heroku Deployment**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-bus-app-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set GOOGLE_API_KEY="your_google_api_key"
heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. **Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Set environment variables in Railway dashboard
# Deploy
railway up
```

### 3. **Render Deployment**

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard

### 4. **DigitalOcean App Platform**

1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
3. Set environment variables
4. Deploy

### 5. **AWS EC2 Deployment**

```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd Bus/backend

# Install dependencies
npm install

# Create .env file
nano .env
# (Add your environment variables)

# Start with PM2
pm2 start index.js --name "bus-backend"
pm2 startup
pm2 save

# Setup Nginx (optional)
sudo apt install nginx
# Configure reverse proxy
```

### 6. **Vercel Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure as Node.js project
```

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `2000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `GOOGLE_API_KEY` | Google Maps API key | `AIzaSy...` |
| `CORS_ORIGIN` | Allowed CORS origins | `https://yourdomain.com` |
| `API_BASE_URL` | Base API URL | `https://api.yourdomain.com` |

## 🔍 Health Check

After deployment, verify your backend is working:

```bash
# Health check endpoint
curl https://your-backend-url.com/health

# Expected response:
{"status":"ok"}
```

## 📊 Monitoring

### Production Logs
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# PM2 (EC2)
pm2 logs bus-backend
```

### Performance Monitoring
- Set up application monitoring (New Relic, DataDog)
- Configure error tracking (Sentry)
- Monitor database performance
- Set up uptime monitoring

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use MongoDB Atlas with IP whitelisting
   - Enable authentication
   - Use connection string with credentials

3. **API Security**
   - Configure CORS properly
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs

4. **Google API Security**
   - Restrict API key to specific domains
   - Enable only required APIs
   - Monitor API usage

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGO_URI format
   - Verify network access
   - Check MongoDB Atlas IP whitelist

2. **Google API Errors**
   - Verify API key is correct
   - Check API restrictions
   - Ensure billing is enabled

3. **CORS Errors**
   - Update CORS_ORIGIN
   - Check frontend domain
   - Verify protocol (http/https)

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify secret consistency

### Debug Commands
```bash
# Check environment variables
node -e "console.log(process.env)"

# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('DB Connected'))"

# Test API endpoints
curl -X GET https://your-backend-url.com/health
```

## 📈 Scaling Considerations

1. **Database Scaling**
   - Use MongoDB Atlas auto-scaling
   - Implement database indexing
   - Consider read replicas

2. **Application Scaling**
   - Use horizontal scaling
   - Implement load balancing
   - Use PM2 cluster mode for multi-core utilization

3. **Caching**
   - Implement Redis caching
   - Cache Google API responses
   - Use CDN for static assets

4. **Performance Optimization**
   - Enable gzip compression
   - Implement API response caching
   - Optimize database queries with indexing

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```
