import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secretkey';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = jwt.verify(token, SECRET) as { userId: number };
        (req as any).user = payload.userId; // add user to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};
