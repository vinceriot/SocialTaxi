import * as jwt from 'jsonwebtoken';

export function parseJwt(token: string): { sub: string; roles?: string[] } {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
  } catch (err) {
    throw new Error('Invalid JWT');
  }
}