import express, { Application, Request, Response } from 'express';
import { IndexRoutes } from './app/routes';
import cors from 'cors';
import { envVars } from './app/config/env';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';

const app: Application = express();

app.use(cors({
    origin: [envVars.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Better Auth handler
// import { auth } from './app/lib/auth';
// import { toNodeHandler } from "better-auth/node";

// app.all("/api/auth/*", (req, res) => {
//     return toNodeHandler(auth)(req, res);
// });
app.use("/api/auth", toNodeHandler(auth))

// Routes
app.use('/api/v1', IndexRoutes);

// Basic route
app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'EcoSpark API is running.....',
        version: '1.0.0',
    });
});

// Not Found handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;