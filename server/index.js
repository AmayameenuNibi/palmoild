import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import passport from "./utils/passport.js";
import path from 'path';
import http from "http";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'https://palmoild-directory.vercel.app/', // Replace with your actual frontend domain
  credentials: true // Allow credentials (e.g., cookies, authorization headers)
}));
passport(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const dirname = path.resolve();
app.use("/uploads", express.static('uploads'))

app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/companies', companyRoutes);
app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
