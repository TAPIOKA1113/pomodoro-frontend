import React from 'react'
import { Button } from '@yamada-ui/react'

interface TodoProps {
    children: React.ReactNode;
    className?: string;
}

function Todo({ children, className }: TodoProps) {
    return (
        <>
            <div className="flex flex-col ">
                <div className="flex justify-between pb-3">
                    <h2 className="text-xl font-semibold mb-3 text-center text-indigo-800">{children}</h2>
                    <Button>Add</Button>
                </div>
                <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>

                    {/* Add your todo list functionality here */}
                </div>
            </div>
        </>
    );
}

export default Todo