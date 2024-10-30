import React, { useState } from 'react'
import { Button, Checkbox, VStack, Text, HStack } from '@yamada-ui/react'
import HabitSettingModal from './Modal/HabitSettingModal'
import useLocalStorage from '../hooks/useLocalStorage';
import { Habit } from '../type/habit';

interface HabitListProps {
    children: React.ReactNode;
    className?: string;
    onPointsUpdate: (points: number) => void;
}

function HabitList({ children, className, onPointsUpdate }: HabitListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);


    const handleHabitComplete = (title: string) => {
        setHabits(prev => prev.map(habit => {
            if (habit.title === title) {
                // ポイントの更新
                onPointsUpdate?.(habit.isCompleted ? -habit.points : habit.points);
                // 完了状態を反転
                return { ...habit, isCompleted: !habit.isCompleted };
            }
            return habit;
        }));
    };


    const handleSaveHabits = (newHabits: Habit[]) => {
        setHabits(newHabits);
        setIsOpen(false);
    };

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between pb-3">
                    <h2 className="text-xl font-semibold mb-3 text-center text-indigo-800">{children}</h2>
                    <Button onClick={() => setIsOpen(true)}>設定</Button>
                </div>
                <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
                    <VStack align="stretch">
                        {habits.map((habit, index) => (
                            <HStack key={index} justify="space-between">
                                <Checkbox
                                    isChecked={habit.isCompleted}
                                    onChange={() => handleHabitComplete(habit.title)}
                                >
                                    <Text>{habit.title}</Text>
                                </Checkbox>
                                <Text fontSize="sm" color="gray.500">
                                    {habit.points} Pt
                                </Text>
                            </HStack>
                        ))}
                        {habits.length === 0 && (
                            <Text color="gray.500" textAlign="center">
                                習慣を設定してください
                            </Text>
                        )}
                    </VStack>
                </div>
            </div>
            <HabitSettingModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSave={handleSaveHabits}
                initialHabits={habits}
            />
        </>
    );
}

export default HabitList