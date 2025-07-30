import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../database';
import { generateToken } from '../utils/jwt.util';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}

};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid Credentials' });

        const token = generateToken(user.id);
        res.json({ token });
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};
