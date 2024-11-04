import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Star } from 'lucide-react';
import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import DatePicker from '../components/Date/DatePicker';
import { updateUserTotalPoints, getUserTotalPoints } from '../utils/supabaseFunction';

function Task() {

    const [selectedDate, setSelectedDate] = useState(new Date());


    const [totalPoints, setTotalPoints] = useState(0);

    //  マウント時に総ポイント数を取得
    useEffect(() => {
        const fetchPoints = async () => {
            const points = await getUserTotalPoints();
            if (points !== null) {
                setTotalPoints(points);
            }
        };
        fetchPoints();
    }, []);


    const handlePointsUpdate = (points: number) => {
        const newTotalPoints = Math.max(0, totalPoints + points)
        setTotalPoints(newTotalPoints);
        updateUserTotalPoints(newTotalPoints)
    };

    const handleDateChange = (date: Date | null) => {
        if (date) setSelectedDate(date);
    };


    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300 ">
            <div className="relative flex justify-center items-center mb-8 ">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    setSelectedDate={setSelectedDate}
                />


                <div className="absolute right-0 bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                    <Star className="text-yellow-400 w-6 h-6" />
                    <span className="text-2xl font-bold text-indigo-700">{totalPoints}</span>
                    <span className="text-lg font-semibold text-indigo-600">Pt</span>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <PomodoloList onPointsUpdate={handlePointsUpdate} selectedDate={selectedDate}>
                    本日のポモドーロ
                </PomodoloList>
            </div>

            <div className="flex justify-around">
                <Todo >
                    Todoリスト
                </Todo>
                <HabitList onPointsUpdate={handlePointsUpdate} selectedDate={selectedDate}>
                    日々の習慣
                </HabitList>
            </div>
        </div>
    );
}

export default Task;