
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authJwtConfig from '../../config/jwt/auth';
import AppError from '../../error/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authJwtConfig.secret);
    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub,
    };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT Token', 401);
  }
}