import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import os from 'os';

import errorHandler from './middlewares/errorHandler.js';
import {
    categoryRouter,
    foodRouter
} from './routes/index.js';

const app = express();
app.enable('trust proxy');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// API routers
app.use('/categories', categoryRouter);
app.use('/foods', foodRouter);

// nginx load balancing 확인 페이지
app.use('/test', (req, res) => {
    res.json({ hostname: os.hostname() });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// ErrorHandler must be declared at bottom
app.use(errorHandler);

export default app;
