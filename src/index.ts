import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { surveyController } from './controllers/survey-controller.js';
import { corsOption } from './cors/cors-option.js';

const app = express();
app.use(cors(corsOption));
app.use(express.json());
app.post('/api/v1/surveys', surveyController.create);
app.get("/api/v1/surveys/reports", surveyController.getSurveyReport);

app.listen(3000, () => console.log('Server running on port 3000'));