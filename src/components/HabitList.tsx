import React, { useState } from 'react'
import { Button, Checkbox, VStack, Text, HStack } from '@yamada-ui/react'
import HabitSettingModal from './Modal/HabitSettingModal'

interface Habit {
    title: string;
    points: number;
}

interface HabitListProps {
    children: React.ReactNode;
    className?: string;
}

function HabitList({ children, className }: HabitListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const handleHabitComplete = (title: string) => {
        if (completedHabits.includes(title)) {
            setCompletedHabits(completedHabits.filter(h => h !== title));
        } else {
            setCompletedHabits([...completedHabits, title]);
        }
    };

    const handleSaveHabits = (newHabits: Habit[]) => {
        setHabits(newHabits);
        setCompletedHabits([]);
        setIsOpen(false);
    };

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between pb-3">
                    <h2 className="text-2xl font-semibold mb-2">{children}</h2>
                    <Button onClick={() => setIsOpen(true)}>設定</Button>
                </div>
                <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
                    <VStack align="stretch">
                        {habits.map((habit, index) => (
                            <HStack key={index} justify="space-between">
                                <Checkbox
                                    isChecked={completedHabits.includes(habit.title)}
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
            />
        </>
    );
}

export default HabitList