import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
  // server config
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  // database config
  DATABASE_URL: z.string().min(1),
  // front end url
  FRONT_END_URL: z.string().min(1),
  // main admin credentials
  USER_NAME: z.string().email(),
  PASSWORD: z.string().min(6),
  // email service config
  // EMAIL_USER: z.string().email(),
  // EMAIL_PASS: z.string().min(6),
  // EMAIL_PORT: z.coerce.number().default(465),
  // EMAIL_HOST: z.string().default("smtp.gmail.com"),
  // EMAIL_SECURE: z.string().default("true"),
  // this is used to sign jwt tokens
  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default("7d"),
  // this is used to sign cookies (to prevent tampering from frontend)
  COOKIE_SECRET: z.string().min(1),
  // time before user is not available after last activity in minutes
  USER_AVAILABILITY_TIMEOUT_MINUTES: z.coerce.number().default(10),
  // time for scheduler to check if there something to do
  SCHEDULER_CHECK_INTERVAL: z.string().default("*/1 * * * *"),
  // firebase push notification config
  // FIREBASE_TYPE: z.string().min(1),
  // FIREBASE_PROJECT_ID: z.string().min(1),
  // FIREBASE_PRIVATE_KEY_ID: z.string().min(1),
  // FIREBASE_PRIVATE_KEY: z.string().min(1),
  // FIREBASE_CLIENT_EMAIL: z.string().email(),
  // FIREBASE_CLIENT_ID: z.string().min(1),
  // FIREBASE_AUTH_URI: z.string().url(),
  // FIREBASE_TOKEN_URI: z.string().url(),
  // FIREBASE_AUTH_PROVIDER_X509_CERT_URL: z.string().url(),
  // FIREBASE_CLIENT_X509_CERT_URL: z.string().url(),
  // FIREBASE_UNIVERSE_DOMAIN: z.string().min(1),
  BASE_PROJECT_DOMAIN: z.string().min(1),
});

const env = envSchema.parse(process.env);
export default env;
