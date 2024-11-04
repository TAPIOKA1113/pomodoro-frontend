import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from '../components/Date/DatePicker';
import useLocalStorage from '../hooks/useLocalStorage';
import { Habit } from '../type/habit';
import { fetchPomodolos } from '../utils/supabaseFunction';

interface Pomodolo {
    id: string;
    title: string;
    setNumber: number;
    currentSets: number;
    date: Date;
}

export default function Report() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [pomodoros, setPomodolos] = useState<Pomodolo[]>([]);
    const [habits] = useLocalStorage<Habit[]>("habits", []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPomodolos(selectedDate);
            setPomodolos(data || []);
        };
        fetchData();
    }, [selectedDate]);

    const handleDateChange = (date: Date | null) => {
        if (date) setSelectedDate(date);
    };

    const filteredPomodoros = pomodoros.filter(pomodoro =>
        new Date(pomodoro.date).toDateString() === selectedDate.toDateString()
    );



    const totalSets = filteredPomodoros.reduce((acc, pomodoro) => acc + pomodoro.setNumber, 0);
    const completedSets = filteredPomodoros.reduce((acc, pomodoro) => acc + pomodoro.currentSets, 0);
    const completionRate = Math.min(totalSets > 0 ? (completedSets / totalSets) * 100 : 0, 100);

    const totalPoints = filteredPomodoros.reduce((acc, pomodoro) => acc + pomodoro.currentSets, 0) + habits.filter(habit => habit.completed_dates.includes(selectedDate.toISOString().split('T')[0])).reduce((acc, habit) => acc + habit.points, 0);


    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        setSelectedDate={setSelectedDate}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        {selectedDate.toLocaleDateString('ja-JP')}の進捗状況
                    </h2>

                    <div className="mb-6">
                        <p className="text-center mb-2">
                            総完了率: {completionRate.toFixed(1)}%
                            ({completedSets} / {totalSets} セット)
                        </p>
                        <p className="text-end text-yellow-600 font-semibold">
                            獲得ポイント: {totalPoints}pt
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>

                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-2">ポモドーロ</h3>
                    </div>

                    {filteredPomodoros.length === 0 ? (
                        <p className="text-center text-gray-500">
                            この日のポモドーロデータはありません
                        </p>
                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPomodoros.map((pomodoro) => (
                                <div key={pomodoro.id} className="bg-gray-50 p-4 rounded-md shadow">
                                    <h3 className="font-semibold mb-2">{pomodoro.title}</h3>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-green-500 h-3 rounded-full"
                                            style={{ width: `${Math.min((pomodoro.currentSets / pomodoro.setNumber) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-right">
                                        {pomodoro.currentSets} / {pomodoro.setNumber} セット
                                        ({((pomodoro.currentSets / pomodoro.setNumber) * 100).toFixed(1)}%)
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-2">習慣</h3>
                    </div>

                    {habits.length === 0 ? (
                        <p className="text-center text-gray-500">
                            習慣がありません
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {habits.map((habit) => (
                                <div key={habit.title}
                                    className={`p-4 rounded-md shadow transition-all duration-200 ${habit.completed_dates.includes(selectedDate.toISOString().split('T')[0]) ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{habit.title}</h3>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}