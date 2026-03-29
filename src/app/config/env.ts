import dotenv from "dotenv";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  STRIPE_SECRET_KEY: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  EMAIL_SENDER_SMTP_USER: string;
  EMAIL_SENDER_SMTP_PASS: string;
  EMAIL_SENDER_SMTP_HOST: string;
  EMAIL_SENDER_SMTP_PORT: string;
  EMAIL_SENDER_SMTP_FROM: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariable = [
    "NODE_ENV",
    "DATABASE_URL",
    "FRONTEND_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "STRIPE_SECRET_KEY",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: (process.env.PORT || "5000") as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
    EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
    EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
    EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
    EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  };
};

export const envVars = loadEnvVariables();
