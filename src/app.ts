import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import pinoHttp, { Options as LoggerOptions } from 'pino-http';
import logger from './core/core.logger.pino';
import v1Router from './presentation/api/v1/api.v1.router';
import redirectRouter from './presentation/api/v1/redirect/redirect.router';

const loggerOptions: LoggerOptions = {
  logger: logger,
  level: 'trace',
};

const corsOptions = { credentials: true, origin: 'http://localhost:4000' };

const app = express();

app.use(pinoHttp(loggerOptions))
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet())

app.use('/api/v1', v1Router);
app.use('/', redirectRouter);

export default app;
