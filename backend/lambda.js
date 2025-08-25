import { config } from 'dotenv';
import serverless from 'serverless-http';
import app from './server.js';

// Load environment variables
config();

// Configure for Lambda
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true);
}

// Export Lambda handler
export const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
  request: (request, event, context) => {
    // Add AWS context to request
    request.serverless = {
      event,
      context
    };
  }
});
