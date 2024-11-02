import { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import useLocalStorage from '../hooks/useLocalStorage';
import DatePicker from '../components/Date/DatePicker';

function Report() {

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date: Date | null) => {
        if (date) setSelectedDate(date);
    };


    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="relative flex justify-center items-center mb-8">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    setSelectedDate={setSelectedDate}
                />
            </div>
        </div>
    );
}

export default Report;