import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import Routes from './src/router.js';
import cors from "cors";

const port = process.env.PORT || 3003;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://104.142.122.231",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use("/api", cors(corsOptions), Routes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
