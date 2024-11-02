import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Star, Calendar } from 'lucide-react';
import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import useLocalStorage from '../hooks/useLocalStorage';

function Task() {

    const getJapanDate = () => {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    };

    const [totalPoints, setTotalPoints] = useLocalStorage<number>("totalPoints", 0);
    const [selectedDate, setSelectedDate] = useState<Date>(getJapanDate());

    const handlePointsUpdate = (points: number) => {
        setTotalPoints(prev => Math.max(0, prev + points));
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="relative flex justify-center items-center mb-8">
                <button
                    onClick={() => setSelectedDate(prev => new Date(prev.getTime() - 24 * 60 * 60 * 1000))}
                    className="mr-4 px-4 py-3 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-300 shadow-md hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                >
                    前日
                </button>

                <div className="relative group">

                    <div
                        className="relative group cursor-pointer"
                    >
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                            dateFormat={selectedDate.toDateString() === new Date().toDateString() ? "yyyy/MM/dd (今日)" : "yyyy/MM/dd"}
                            locale="ja"
                            className="w-60 py-3 text-lg font-semibold text-indigo-700 bg-white border-2 border-indigo-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:border-indigo-400 text-center"
                        />
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate(getJapanDate());
                            }}
                            className="group/icon"
                            title="クリックで今日の日付に戻ります"
                        >
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-auto cursor-pointer transition-all duration-300 ease-in-out group-hover/icon:text-indigo-600 group-hover/icon:scale-110" />
                            <span className="absolute invisible group-hover/icon:visible whitespace-nowrap bg-indigo-600 text-white text-sm px-2 py-1 rounded-md -top-8 right-0 transform transition-all duration-300 ease-in-out">
                                今日に戻る
                                <span className="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-indigo-600"></span>
                            </span>
                        </div>
                    </div>

                </div>
                <button
                    onClick={() => setSelectedDate(prev => new Date(prev.getTime() + 24 * 60 * 60 * 1000))}
                    className="ml-4 px-4 py-3 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-300 shadow-md hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                >
                    翌日
                </button>


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