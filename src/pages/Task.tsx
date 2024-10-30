import { useState } from 'react';
import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import { Star } from 'lucide-react'


function Task() {

    const [totalPoints, setTotalPoints] = useState(0);

    const handlePointsUpdate = (points: number) => {
        setTotalPoints(prev => prev + points);
    };

    return (
        <div className="flex flex-col justify-around h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-100">
            <div className="flex justify-end mb-4">
                <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                    <Star className="text-yellow-400 w-6 h-6" />
                    <span className="text-2xl font-bold text-indigo-700">{totalPoints}</span>
                    <span className="text-lg font-semibold text-indigo-600">Pt</span>
                </div>
            </div>
            <div className="flex justify-center mb-8">
                <PomodoloList className="w-80 h-80 bg-white rounded-lg shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center text-indigo-800">本日のポモドーロ</h2>
                </PomodoloList>
            </div>
            <div className="flex justify-around">
                <Todo className="w-80 h-80 bg-white rounded-lg shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-center text-indigo-800">Todoリスト</h2>
                </Todo>
                <HabitList className="w-80 h-80 bg-white rounded-lg shadow-xl p-6" onPointsUpdate={handlePointsUpdate}>
                    <h2 className="text-xl font-semibold mb-4 text-center text-indigo-800">日々の習慣</h2>
                </HabitList>
            </div>
        </div>
    );
}

export default Task;