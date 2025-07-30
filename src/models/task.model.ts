export interface Task {
    id: number;
    userId: number;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed';
}
