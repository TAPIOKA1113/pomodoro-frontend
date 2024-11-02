// import { useState } from 'react'
import { Calendar } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
    selected: Date;
    onChange: (date: Date | null) => void;
    setSelectedDate: (date: Date) => void;
}


export default function DatePicker({ selected, onChange, setSelectedDate }: DatePickerProps) {

    const getJapanDate = () => {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    };



    return (
        <>
            <button
                onClick={() => setSelectedDate(new Date(selected.getTime() - 24 * 60 * 60 * 1000))}
                className="mr-4 px-4 py-3 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-300 shadow-md hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
            >
                前日
            </button>

            <div className="relative group">

                <div
                    className="relative group cursor-pointer"
                >
                    <ReactDatePicker
                        selected={selected}
                        onChange={onChange}
                        dateFormat={selected.toDateString() === new Date().toDateString() ? "yyyy/MM/dd (今日)" : "yyyy/MM/dd"}
                        locale="ja"
                        className="w-60 py-3 text-lg font-semibold text-indigo-700 bg-white border-2 border-indigo-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-300 ease-in-out hover:bg-indigo-50 hover:border-indigo-400 text-center"
                    />
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(getJapanDate());
                        }}
                        className="group/icon"
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
                onClick={() => setSelectedDate(new Date(selected.getTime() + 24 * 60 * 60 * 1000))}
                className="ml-4 px-4 py-3 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-300 shadow-md hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
            >
                翌日
            </button>
        </>



    )
}



