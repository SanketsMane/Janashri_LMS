# 🚀 Quick AWS Deployment Guide

## ✅ CORS Issues Fixed!

Your backend now has flexible CORS handling that works with:
- ✅ All localhost ports (development)
- ✅ Vercel domains (*.vercel.app)
- ✅ AWS domains (*.amazonaws.com, *.elasticbeanstalk.com)
- ✅ Any origin in development mode
- ✅ Proper preflight handling

## 🎯 Quick AWS Lambda Deployment

### Step 1: Install Serverless Framework
```bash
npm install -g serverless
```

### Step 2: Configure AWS Credentials
```bash
# Install AWS CLI
npm install -g aws-cli

# Configure credentials
aws configure
# Enter your AWS Access Key ID, Secret Key, Region (us-east-1)
```

### Step 3: Deploy to Lambda
```bash
cd backend
npm install
serverless deploy
```

### Step 4: Get Your API URL
After deployment, you'll get:
```
endpoints:
  ANY - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
  ANY - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

Your API base URL: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api`

### Step 5: Update Frontend
In Vercel dashboard, set environment variable:
```
VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api
```

## 🛠️ Environment Variables for AWS

Copy these to AWS Lambda Environment Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://hackable3030:l6QoCaGEbKBFh8Sz@cluster0.akd5rob.mongodb.net/janashiri_lms_prod?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_123456789_PROD
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contactsanket1@gmail.com
EMAIL_PASS=mwvy tygt nsri vbox
EMAIL_FROM=contactsanket1@gmail.com
CLOUDINARY_CLOUD_NAME=dr7mlwdso
CLOUDINARY_API_KEY=564439426461569
CLOUDINARY_API_SECRET=yH7p_TOyWeEQjCfRaxwxxLc0FG0
ADMIN_EMAIL=admin@janashiri.edu
ADMIN_PASSWORD=Admin@123456
```

## ✅ Test Your Deployment

1. Health Check: `https://your-lambda-url.amazonaws.com/dev/api/health`
2. Test CORS: Open browser console and check for CORS errors
3. Test API: Try login from your frontend

## 🎉 Done!

Your backend is now deployed on AWS with zero CORS issues! 🚀
