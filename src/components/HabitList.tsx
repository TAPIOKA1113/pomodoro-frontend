import React, { useState, useEffect } from 'react'
import { Button, Checkbox, VStack, Text, HStack } from '@yamada-ui/react'
import HabitSettingModal from './Modal/HabitSettingModal'

import { Habit } from '../type/habit';
import { fetchHabits } from '../utils/supabaseFunction';

interface HabitListProps {
    children: React.ReactNode;
    className?: string;
    onPointsUpdate: (points: number) => void;
    selectedDate: Date;
}

function HabitList({ children, onPointsUpdate, selectedDate }: HabitListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchHabits();
            console.log(selectedDate)
            setHabits(data || []);
        };
        fetchData();
    }, [selectedDate]);

    // 特定の日付の習慣が完了しているかチェック
    const isHabitCompletedForDate = (habit: Habit, date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return habit.completed_dates.includes(dateStr);
    };


    const handleHabitComplete = (title: string, date: Date) => {
        const dateStr = date.toISOString().split('T')[0]; // DatePickerで選択した日付　

        setHabits(prev => prev.map(habit => {
            if (habit.title === title) {
                const isCurrentlyCompleted = isHabitCompletedForDate(habit, date);
                const newcompleted_dates = isCurrentlyCompleted
                    ? habit.completed_dates.filter(d => d !== dateStr)
                    : [...habit.completed_dates, dateStr];

                // ポイントの更新
                onPointsUpdate?.(isCurrentlyCompleted ? -habit.points : habit.points);

                return {
                    ...habit,
                    completed_dates: newcompleted_dates
                };
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
                <div className="flex justify-between items-center pb-3">
                    <div className="flex-1" />
                    <h2 className="text-xl font-semibold text-indigo-800">{children}</h2>
                    <div className="flex-1 flex justify-end">
                        <Button onClick={() => setIsOpen(true)}>設定</Button>
                    </div>
                </div>
                <div className={`bg-white shadow-md rounded-lg w-[500px] h-80 p-6`}>
                    <VStack align="stretch">
                        {habits.map((habit, index) => (
                            <HStack key={index} justify="space-between" p="2" _hover={{ bg: "gray.50" }} rounded="md">
                                <Checkbox
                                    isChecked={isHabitCompletedForDate(habit, selectedDate)}
                                    onChange={() => handleHabitComplete(habit.title, selectedDate)}
                                    colorScheme="primary"
                                    size="lg"
                                    _checked={{
                                        "& span svg": {
                                            color: "white",
                                            transform: "scale(1)",
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <Text fontSize="md" ml="2"
                                        fontWeight={isHabitCompletedForDate(habit, selectedDate) ? "medium" : "normal"}
                                        color={isHabitCompletedForDate(habit, selectedDate) ? "gray.500" : "gray.800"}
                                        textDecoration={isHabitCompletedForDate(habit, selectedDate) ? "line-through" : "none"}>
                                        {habit.title}
                                    </Text>
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