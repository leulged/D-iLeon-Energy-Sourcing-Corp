# Deployment Configuration - D'iLeon Energy Sourcing Corp

## 🚀 Deployment Overview

This document outlines the deployment strategy for the D'iLeon platform across different environments.

### Architecture

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: Node.js API deployed on Render/Heroku
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: AWS S3 or Firebase Storage
- **CDN**: Vercel Edge Network (frontend)

## 📦 Frontend Deployment (Vercel)

### Prerequisites

- Vercel account
- GitHub repository connected
- Environment variables configured

### Setup Steps

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy from client directory
   cd client
   vercel
   ```

2. **Environment Variables**

   ```env
   NEXT_PUBLIC_API_URL=https://api.dileon.com/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_APP_URL=https://dileon.com
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

3. **Build Configuration**

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

4. **Custom Domain Setup**
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - Enable HTTPS

### Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-key"
  }
}
```

## 🔧 Backend Deployment (Render)

### Prerequisites

- Render account
- GitHub repository connected
- MongoDB Atlas cluster

### Setup Steps

1. **Create Web Service**

   - Connect GitHub repository
   - Set root directory to `server`
   - Configure build settings

2. **Environment Variables**

   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dileon
   JWT_SECRET=your-super-secret-production-jwt-key
   JWT_EXPIRES_IN=7d
   STRIPE_SECRET_KEY=sk_live_...
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=dileon-production
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Build Configuration**

   ```bash
   # Build Command
   npm install && npm run build

   # Start Command
   npm run start
   ```

4. **Health Check**
   - Endpoint: `/api/health`
   - Expected response: `{"status": "ok"}`

### Render Configuration (render.yaml)

```yaml
services:
  - type: web
    name: dileon-api
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/health
    autoDeploy: true
```

## 🗄️ Database Deployment (MongoDB Atlas)

### Setup Steps

1. **Create Cluster**

   - Choose M10 or higher for production
   - Select preferred region
   - Configure backup settings

2. **Database Access**

   ```javascript
   // Create database user
   db.createUser({
     user: "dileon_user",
     pwd: "secure_password",
     roles: [{ role: "readWrite", db: "dileon" }],
   });
   ```

3. **Network Access**

   - Allow access from anywhere (0.0.0.0/0)
   - Or restrict to Render IP ranges

4. **Connection String**
   ```
   mongodb+srv://dileon_user:secure_password@cluster.mongodb.net/dileon?retryWrites=true&w=majority
   ```

## ☁️ File Storage (AWS S3)

### Setup Steps

1. **Create S3 Bucket**

   ```bash
   # Bucket name: dileon-production
   # Region: us-east-1
   # Versioning: Enabled
   # Encryption: SSE-S3
   ```

2. **IAM User**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::dileon-production/*"
       }
     ]
   }
   ```

3. **CORS Configuration**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
       "AllowedOrigins": ["https://dileon.com"],
       "ExposeHeaders": []
     }
   ]
   ```

## 🔐 SSL/TLS Configuration

### Frontend (Vercel)

- Automatic SSL certificates
- HTTP/2 enabled
- HSTS headers configured

### Backend (Render)

- Automatic SSL certificates
- Custom domain support
- Force HTTPS redirect

### Custom Domain Setup

```bash
# DNS Records
# A Record: dileon.com -> Vercel IP
# CNAME Record: www.dileon.com -> dileon.com
# CNAME Record: api.dileon.com -> Render URL
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

```javascript
// Frontend (Next.js)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Backend (Node.js)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

- Vercel Analytics (frontend)
- Render Metrics (backend)
- MongoDB Atlas Performance Advisor

### Logging

```javascript
// Structured logging
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm run install:all
      - run: npm run test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
            -H "Authorization: Bearer $RENDER_TOKEN" \
            -H "Content-Type: application/json"
        env:
          SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
          RENDER_TOKEN: ${{ secrets.RENDER_TOKEN }}
```

## 🚨 Environment-Specific Configurations

### Development

```env
NODE_ENV=development
API_URL=http://localhost:5000/api
DATABASE_URL=mongodb://localhost:27017/dileon-dev
```

### Staging

```env
NODE_ENV=staging
API_URL=https://staging-api.dileon.com/api
DATABASE_URL=mongodb+srv://.../dileon-staging
```

### Production

```env
NODE_ENV=production
API_URL=https://api.dileon.com/api
DATABASE_URL=mongodb+srv://.../dileon
```

## 🔍 Health Checks & Monitoring

### Health Check Endpoints

```javascript
// Frontend health check
GET /api/health
Response: { "status": "ok", "timestamp": "..." }

// Backend health check
GET /api/health
Response: {
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Monitoring Alerts

- Uptime monitoring (UptimeRobot)
- Error rate alerts (Sentry)
- Performance degradation (Vercel/Render)
- Database connection issues (MongoDB Atlas)

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates valid
- [ ] Monitoring configured

### Post-Deployment

- [ ] Health checks passing
- [ ] Smoke tests completed
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User acceptance testing
- [ ] Rollback plan ready

---

**Remember**: Always test deployments in staging environment first!
