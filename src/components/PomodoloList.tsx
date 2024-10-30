import React, { useState } from 'react'
import PomodoloSettingModal from './Modal/PomodoloSettingModal';
import { Button, VStack, Text, HStack, IconButton } from '@yamada-ui/react'
import { FiMinus } from 'react-icons/fi';
import useLocalStorage from '../hooks/useLocalStorage';

interface Pomodolo {
    title: string;
    setCount: number;
    remainingSets: number;
}

interface PomodoloListProps {
    children: React.ReactNode;
    className?: string;
    onPointsUpdate: (points: number) => void;
}

function PomodoloList({ children, className, onPointsUpdate }: PomodoloListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pomodolos, setPomodolos] = useLocalStorage<Pomodolo[]>("pomodolos", []);

    const handleSetComplete = (title: string) => {
        setPomodolos(prev => prev.map(pomodolo => {
            if (pomodolo.title === title && pomodolo.remainingSets > 0) {
                // 残りセット数を減らし、ポイントを加算
                onPointsUpdate?.(1);
                return {
                    ...pomodolo,
                    remainingSets: pomodolo.remainingSets - 1
                };
            }
            return pomodolo;
        }));
    };

    const handleSavePomodolo = (newPomodolos: Pomodolo[]) => {
        // 新しいポモドーロリストを保存する際に、remainingSetsを初期化
        const pomodolosWithRemaining = newPomodolos.map(pomodolo => ({
            ...pomodolo,
            remainingSets: pomodolo.setCount
        }));
        setPomodolos(pomodolosWithRemaining);
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
                                    <Text fontSize="sm" color={pomodolo.remainingSets > 0 ? "gray.500" : "red.500"}>
                                        残り {pomodolo.remainingSets} / {pomodolo.setCount} セット
                                    </Text>
                                    <IconButton
                                        aria-label="セットを完了"
                                        icon={<FiMinus />}
                                        size="sm"
                                        isDisabled={pomodolo.remainingSets <= 0}
                                        onClick={() => handleSetComplete(pomodolo.title)}
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