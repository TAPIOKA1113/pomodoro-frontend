import React from 'react'
import { Button } from '@yamada-ui/react'

interface TodoProps {
    children: React.ReactNode;
    className?: string;
}

function Todo({ children }: TodoProps) {
    return (
        <>
            <div className="flex flex-col ">
                <div className="flex justify-between items-center pb-3">
                    <div className="flex-1" />
                    <h2 className="text-xl font-semibold text-indigo-800">{children}</h2>
                    <div className="flex-1 flex justify-end">
                        <Button >設定</Button>
                    </div>
                </div>
                <div className={`bg-white shadow-md rounded-lg w-[500px] h-80 p-6 overflow-auto`}>
                </div>
            </div>
        </>
    );
}

export default Todo