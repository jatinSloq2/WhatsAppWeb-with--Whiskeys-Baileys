import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import router from './routes/index.routes.js';

dotenv.config();
const app = express();

/* -------------------------
        CORS SETUP
-------------------------- */
app.use(
  cors({
    origin: true,            // allows all origins dynamically
    credentials: true        // allow cookies, auth headers
  })
);

/* -------------------------
        Middlewares
-------------------------- */
app.use(express.json());
app.use(cookieParser());

// Morgan with timestamps
morgan.token('date', () => new Date().toISOString());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :date')
);

/* -------------------------
          ROUTES
-------------------------- */
app.use('/', router);

// Health Route
app.get('/server/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

/* -------------------------
       404 Handler
-------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

/* -------------------------
  GLOBAL ERROR HANDLER
-------------------------- */
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* -------------------------
     START SERVER
-------------------------- */
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(
    `Server started on http://localhost:${PORT} at ${new Date().toISOString()}`
  );
});
