require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = require('express')();

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');

const connectDB = require('./db/connect');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// middleware
app.set('trust proxy', 1); // needed for rateLimiter + Heroku
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
  }),
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () =>
      console.log(`[system] Server is listening on port ${PORT}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
