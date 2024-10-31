import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import { Star } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage';
// import { Popover, PopoverTrigger, PopoverContent, Button } from '@yamada-ui/react';
// import { DatePicker, Calendar } from '@yamada-ui/calendar';
// import { CalendarIcon } from '@yamada-ui/lucide';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react';



function Task() {

    const [totalPoints, setTotalPoints] = useLocalStorage<number>("totalPoints", 0);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handlePointsUpdate = (points: number) => {
        setTotalPoints(prev => Math.max(0, prev + points));
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="flex justify-between items-center mb-8">
                <DatePicker
                    className="w-full"
                    placeholderText="日付を選択"
                    dateFormat="yyyy/MM/dd"
                    locale="ja"
                    selected={selectedDate}
                    onChange={date => {
                        setSelectedDate(date!);
                        console.log(date);
                    }}

                />
                <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                    <Star className="text-yellow-400 w-6 h-6" />
                    <span className="text-2xl font-bold text-indigo-700">{totalPoints}</span>
                    <span className="text-lg font-semibold text-indigo-600">Pt</span>
                </div>
            </div>
            <div className="flex justify-center mb-8 ">
                <PomodoloList onPointsUpdate={handlePointsUpdate} selectedDate={selectedDate}>
                    本日のポモドーロ
                </PomodoloList>
            </div>
            <div className="flex justify-around ">
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