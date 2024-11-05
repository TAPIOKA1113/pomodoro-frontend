export interface Habit {
    id: string,
    title: string;
    points: number;
    completed_dates: string[] | null;
}