import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from '../components/Date/DatePicker';
import useLocalStorage from '../hooks/useLocalStorage';

interface Pomodolo {
    id: string;
    title: string;
    setNumber: number;
    currentSets: number;
    date: Date;
}

export default function Report() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [pomodoros] = useLocalStorage<Pomodolo[]>("pomodolos", []);

    const handleDateChange = (date: Date | null) => {
        if (date) setSelectedDate(date);
    };

    const filteredPomodoros = pomodoros.filter(pomodoro =>
        new Date(pomodoro.date).toDateString() === selectedDate.toDateString()
    );

    const totalSets = filteredPomodoros.reduce((acc, pomodoro) => acc + pomodoro.setNumber, 0);
    const completedSets = filteredPomodoros.reduce((acc, pomodoro) => acc + pomodoro.currentSets, 0);
    const completionRate = Math.min(totalSets > 0 ? (completedSets / totalSets) * 100 : 0, 100);

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
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
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
                </div>
            </div>
        </div>
    );
}