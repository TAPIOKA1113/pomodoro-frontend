import React, { useState } from 'react'
import PomodoloSettingModal from './Modal/PomodoloSettingModal';
import { Button, VStack, Text, HStack, IconButton } from '@yamada-ui/react'
import { FiMinus, FiPlus } from 'react-icons/fi';
import useLocalStorage from '../hooks/useLocalStorage';

interface Pomodolo {
    title: string;
    setNumber: number;
    currentSets: number;
}

interface PomodoloListProps {
    children: React.ReactNode;
    className?: string;
    onPointsUpdate: (points: number) => void;
}

function PomodoloList({ children, className, onPointsUpdate }: PomodoloListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pomodolos, setPomodolos] = useLocalStorage<Pomodolo[]>("pomodolos", []);

    const handleMinusPomodolo = (title: string) => {
        setPomodolos(prev => prev.map(pomodolo => {
            if (pomodolo.title === title) {
                if (pomodolo.setNumber > pomodolo.currentSets) {
                    // ポイントを減らす
                    onPointsUpdate?.(-1);
                    return {
                        ...pomodolo,
                        currentSets: pomodolo.currentSets - 1
                    };
                } else {
                    onPointsUpdate?.(-1.5);
                    return {
                        ...pomodolo,
                        currentSets: pomodolo.currentSets - 1
                    };
                }

            }
            return pomodolo;
        }));
    };

    const handlePlusPomodolo = (title: string) => {
        setPomodolos(prev => prev.map(pomodolo => {
            if (pomodolo.title === title) {
                if (pomodolo.setNumber > pomodolo.currentSets) {
                    // ポイントを加算
                    onPointsUpdate?.(1);
                    return {
                        ...pomodolo,
                        currentSets: pomodolo.currentSets + 1
                    };
                } else {
                    onPointsUpdate?.(1.5);
                    return {
                        ...pomodolo,
                        currentSets: pomodolo.currentSets + 1
                    };
                }

            }
            return pomodolo;
        }));
    };

    const handleSavePomodolo = (newPomodolos: Pomodolo[]) => {
        // 既存のポモドーロのremainingsSetsを維持しつつ、新しいポモドーロは初期化
        setPomodolos(newPomodolos);
        setIsOpen(false);
    };



    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between pb-3">
                    <h2 className="text-xl font-semibold mb-4 text-center text-indigo-800">{children}</h2>
                    <Button onClick={() => setIsOpen(true)}>設定</Button>
                </div>
                <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
                    <VStack align="stretch">
                        {pomodolos.map((pomodolo, index) => (
                            <HStack key={index} justify="space-between">
                                <Text>{pomodolo.title}</Text>
                                <HStack >
                                    <IconButton
                                        icon={<FiMinus />}
                                        size="sm"
                                        isDisabled={pomodolo.currentSets <= 0}
                                        onClick={() => handleMinusPomodolo(pomodolo.title)}
                                    />

                                    <Text fontSize="sm" color={pomodolo.currentSets >= pomodolo.setNumber ? "green.500" : "gray.500"}>
                                        {pomodolo.currentSets} / {pomodolo.setNumber} セット
                                    </Text>

                                    <IconButton
                                        icon={<FiPlus />}
                                        size="sm"
                                        onClick={() => handlePlusPomodolo(pomodolo.title)}
                                    />
                                </HStack>
                            </HStack>
                        ))}
                        {pomodolos.length === 0 && (
                            <Text color="gray.500" textAlign="center">
                                ポモドーロを設定してください
                            </Text>
                        )}
                    </VStack>
                </div>
            </div>
            <PomodoloSettingModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSave={handleSavePomodolo}
                initialHabits={pomodolos}
            />
        </>
    );
}

export default PomodoloList