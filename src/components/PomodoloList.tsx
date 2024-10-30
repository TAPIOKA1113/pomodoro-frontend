import React from 'react'

interface TodoProps {
    children: React.ReactNode;
    className?: string;
}

function PomodoloList({ children, className }: TodoProps) {
    return (
        <>
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-2 flex justify-center">{children}</h2>
                <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>

                    {/* Add your todo list functionality here */}
                </div>
            </div>
        </>
    );
}

export default PomodoloList