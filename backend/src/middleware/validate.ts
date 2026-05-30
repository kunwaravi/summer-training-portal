import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      logger.error(`Validation Check: Missing required fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        message: `Validation Error: Missing required fields: ${missingFields.join(', ')}`
      });
    }
    next();
  };
};
