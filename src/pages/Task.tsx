import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Star, Calendar } from 'lucide-react';
import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import useLocalStorage from '../hooks/useLocalStorage';
import { Button } from '@yamada-ui/react';

function Task() {
    const [totalPoints, setTotalPoints] = useLocalStorage<number>("totalPoints", 0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handlePointsUpdate = (points: number) => {
        setTotalPoints(prev => Math.max(0, prev + points));
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="relative flex justify-center items-center mb-8">
                <Button onClick={() => setSelectedDate(prev => new Date(prev.getTime() - 24 * 60 * 60 * 1000))}>
                    前日
                </Button>
                <div className="relative group">

                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                        dateFormat="yyyy/MM/dd"
                        locale="ja"
                        className="w-64 px-4 py-3 text-lg font-semibold text-indigo-700 bg-white border-2 border-indigo-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:border-indigo-400"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none transition-all duration-300 ease-in-out group-hover:text-indigo-600 group-hover:scale-110" />


                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-indigo-500 transition-all duration-300 ease-in-out group-hover:w-5/6"></div>
                </div>
                <Button onClick={() => setSelectedDate(prev => new Date(prev.getTime() + 24 * 60 * 60 * 1000))}>
                    翌日
                </Button>

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