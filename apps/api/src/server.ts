import 'express-async-errors';
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express'
import { errors } from 'celebrate'
import routes from './routes'
import AppError from './error/AppError';

export const prisma = new PrismaClient();

const app = express();

app.use(express.json())


app.use(routes)
app.use(errors())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});
/* process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----')
  console.log(error)
  console.log('----- Exception origin -----')
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('----- Unhandled Rejection at -----')
  console.log(promise)
  console.log('----- Reason -----')
  console.log(reason)
}) */
app.listen(3333, () => console.log('server running on port 3333'))