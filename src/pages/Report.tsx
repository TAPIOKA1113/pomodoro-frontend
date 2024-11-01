import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Star, Calendar } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

function Report() {
    const [totalPoints] = useLocalStorage<number>("totalPoints", 0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());


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
                        onClick={() => setSelectedDate(new Date())}
                        title="クリックで今日の日付に戻ります"
                    >
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                            dateFormat="yyyy/MM/dd"
                            locale="ja"
                            className="w-60 py-3 text-lg font-semibold text-indigo-700 bg-white border-2 border-indigo-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:border-indigo-400 text-center"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none transition-all duration-300 ease-in-out group-hover:text-indigo-600 group-hover:scale-110" />
                        {/* <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-indigo-500 transition-all duration-300 ease-in-out group-hover:w-full"></div> */}
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


        </div>
    );
}

export default Report;