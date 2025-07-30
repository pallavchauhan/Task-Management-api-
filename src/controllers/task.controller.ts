import { Request, Response } from 'express';
import pool from '../database';

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;
        const { title, description, dueDate, status } = req.body;

        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, description, dueDate, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;

        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;
        const taskId = req.params.id;
        const { title, description, dueDate, status } = req.body;

        // Check Ownership
        const taskCheck = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
        if (taskCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, due_date = $3, status = $4 WHERE id = $5 RETURNING *',
            [title, description, dueDate, status, taskId]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;
        const taskId = req.params.id;

        const taskCheck = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
        if (taskCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        res.status(204).send();
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};

export const getTaskSummary = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user;

        const summaryResult = await pool.query(
            `SELECT status, COUNT(*) as count FROM tasks WHERE user_id = $1 GROUP BY status`,
            [userId]
        );

        const overdueResult = await pool.query(
            `SELECT COUNT(*) as overdue FROM tasks WHERE user_id = $1 AND due_date < NOW() AND status != 'completed'`,
            [userId]
        );

        const summary: { [key: string]: number } = {};
        summaryResult.rows.forEach(row => {
            summary[row.status] = parseInt(row.count);
        });

        res.json({
            summary,
            overdueCount: parseInt(overdueResult.rows[0].overdue)
        });
    } catch (err: any) {
    console.error(err);  // <-- Add this to see actual DB or code error
    res.status(500).json({ error: 'Server Error', message: err.message });
}
};
