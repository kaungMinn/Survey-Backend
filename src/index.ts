import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { corsOption } from './cors/cors-option.js';
import { scraperRouter } from './router/scraper.routes.js';

const app = express();
app.use(cors(corsOption));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/scraper", scraperRouter);

app.listen(3000, () => console.log('Server running on port 3000'));


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Only show stack trace if not in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });


});