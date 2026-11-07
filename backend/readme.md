# Fastify Template

A modern Fastify.js template with TypeScript, Prisma, authentication, and best practices.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Caching](#caching)

## Prerequisites

### Environment Setup

1. Create a `.env` file in the root directory
2. Add the following environment variables:

#### Required Variables
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# Frontend URL
FRONT_END_URL="http://localhost:3000"

# Main Admin Credentials
USER_NAME="admin@example.com"
PASSWORD="your_secure_password"

# Email Service Configuration
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_SECURE="true"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key"
JWT_ACCESS_TOKEN_EXPIRES_IN="7d"

# Cookie Configuration
COOKIE_SECRET="your_cookie_secret_key"

# Firebase Push Notification Configuration
FIREBASE_TYPE="service_account"
FIREBASE_PROJECT_ID="your_firebase_project_id"
FIREBASE_PRIVATE_KEY_ID="your_private_key_id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your_client_id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
FIREBASE_UNIVERSE_DOMAIN="googleapis.com"
```

#### Optional Variables (with defaults)
```env
# Server Configuration
PORT=3333
NODE_ENV="development"

# User Availability Timeout (in minutes)
USER_AVAILABILITY_TIMEOUT_MINUTES=10

# Scheduler Check Interval (cron format)
SCHEDULER_CHECK_INTERVAL="*/1 * * * *"
```

**Note:** Replace all placeholder values with your actual configuration. For Firebase setup, download your service account key from Firebase Console.

## Getting Started

### Installation & Setup

```bash
# Install project dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial admin user
npm run seed

# Start the server
npm start
```

## API Documentation

### Response Format

#### Success Response
```json
[...] | {...}
```

#### Error Response
```json
{
  "status": "error", 
  "code": "Error code",
  "message": "Error message",
  "errors": {...}
}
```

## Error Handling

**⚠️ Important:** Don't use try-catch blocks for error responses. Instead, use `CustomError` for consistent error handling:

```typescript
// ❌ Don't do this
try {
  // some operation
} catch (error) {
  return reply.status(400).send({
    status: "error",
    message: "Something went wrong"
  });
}

// ✅ Do this instead
import { CustomError } from "src/utils/custom-error";
import { HttpConstant } from "src/constants/HttpConstant";

// Throw CustomError for proper error handling
throw new CustomError({
  message: "User not found",
  statusCode: HttpConstant.NOT_FOUND,
  code: "user_not_found"
});
```

The `CustomError` will be automatically caught by the global error handler and formatted consistently.

## Caching

### Redis Caching Example

```typescript
// Example with Redis caching
// Check if data exists in cache
const cached = await fastify.redis.get("users");
if (cached) {
   return reply.status(HttpConstant.OK)
      .header("x-cache-status", "HIT")
      .send(cached);
}

// If not in cache, fetch from database
const users = await fastify.prisma.user.findMany({
   omit: {
      reset_password_code: true,
      refreshToken: true,
      password: true,
   },
   include: {
      user_type: true,
   },
});

// Store in cache for 10 seconds
await fastify.redis.set("users", JSON.stringify(users), "EX", 10);

return reply.status(HttpConstant.OK)
   .header("x-cache-status", "MISS")
   .send(users);
```