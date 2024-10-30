import { useState } from 'react';
import Todo from '../components/TodoList';
import PomodoloList from '../components/PomodoloList';
import HabitList from '../components/HabitList';



function Task() {

    return (
        <div className="flex flex-col justify-around h-screen p-8">
            <div className="flex justify-center ">
                <PomodoloList className="w-64 h-64">本日のポモドーロ</PomodoloList>
            </div>
            <div className="flex justify-around">
                <Todo className="w-64 h-64">Todoリスト</Todo>
                <HabitList className="w-64 h-64">日々の習慣</HabitList>
            </div>
        </div>
    );
}

export default Task;