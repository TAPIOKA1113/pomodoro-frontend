import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';
import { Star } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage';


function Task() {

    const [totalPoints, setTotalPoints] = useLocalStorage<number>("totalPoints", 0);

    const handlePointsUpdate = (points: number) => {
        setTotalPoints(prev => Math.max(0, prev + points));
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="flex justify-end mb-4">
                <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                    <Star className="text-yellow-400 w-6 h-6" />
                    <span className="text-2xl font-bold text-indigo-700">{totalPoints}</span>
                    <span className="text-lg font-semibold text-indigo-600">Pt</span>
                </div>
            </div>
            <div className="flex justify-center mb-8 ">
                <PomodoloList className="w-80 h-80 bg-white rounded-lg shadow-xl p-6" onPointsUpdate={handlePointsUpdate}>
                    本日のポモドーロ
                </PomodoloList>
            </div>
            <div className="flex justify-around ">
                <Todo className="w-80 h-80 bg-white rounded-lg shadow-xl p-6">
                    Todoリスト
                </Todo>
                <HabitList className="w-80 h-80 bg-white rounded-lg shadow-xl p-6" onPointsUpdate={handlePointsUpdate}>
                    日々の習慣
                </HabitList>
            </div>
        </div>
    );
}

export default Task;