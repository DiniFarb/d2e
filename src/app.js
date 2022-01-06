import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares.js';
import api from './routes/api.js';
import { config } from 'dotenv';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + '/public/'));
app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

export default app;
