import React, { useState, useEffect } from 'react'
import PomodoloSettingModal from './Modal/PomodoloSettingModal';
import CountdownTimerModal from './Modal/CountdownTimerModal';
import { Button, VStack, Text, HStack, IconButton } from '@yamada-ui/react'
import { FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import { Pomodolo } from '../type/pomodolo';
import { fetchPomodolos, updatePomodoloCount, addPomodoloItem } from '../utils/supabaseFunction';


interface PomodoloListProps {
    children: React.ReactNode;
    className?: string;
    onPointsUpdate: (points: number) => void;
    selectedDate: Date;
}

function PomodoloList({ children, onPointsUpdate, selectedDate }: PomodoloListProps) {
    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
    const [pomodolos, setPomodolos] = useState<Pomodolo[]>([]);

    const [selectedPomodolo, setSelectedPomodolo] = useState<Pomodolo>(); // タイマーコンポーネントに渡されるタスクID


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPomodolos(selectedDate);
            console.log(selectedDate)
            setPomodolos(data || []);
        };
        fetchData();
    }, [selectedDate]);

    const handleMinusPomodolo = (id: string) => {

        updatePomodoloCount(id, -1);
        setPomodolos(prev => prev.map(pomodolo => {
            if (pomodolo.id === id) {
                if (pomodolo.setNumber >= pomodolo.currentSets) {
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

    const handlePlusPomodolo = (id: string) => {

        updatePomodoloCount(id, 1);

        setPomodolos(prev => prev.map(pomodolo => {
            if (pomodolo.id === id) {
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

    const handleSavePomodolo = async (newPomodolos: Pomodolo[], selectedDate: Date) => {
        // すべてのポモドーロの追加を待つ
        await Promise.all(newPomodolos.map(pomodolo =>
            addPomodoloItem(pomodolo.title, pomodolo.setNumber, selectedDate)
        ));

        // データベースから最新のデータを取得
        const updatedPomodolos = await fetchPomodolos(selectedDate);
        setPomodolos(updatedPomodolos || []);
        setIsSettingModalOpen(false);

    };


    const handleTimerModalClose = () => {

        setIsTimerModalOpen(false)

    }


    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between items-center pb-3">
                    <div className="flex-1" />
                    <h2 className="text-xl font-semibold text-indigo-800">{children}</h2>
                    <div className="flex-1 flex justify-end">
                        <Button onClick={() => setIsSettingModalOpen(true)}>設定</Button>
                    </div>
                </div>
                <div className={`bg-white shadow-md rounded-lg w-[1000px] h-80 p-6 overflow-auto`}>
                    <VStack align="stretch">
                        {pomodolos
                            .sort((a, b) => {
                                // created_atでソート（昇順）
                                const aTime = new Date(a.created_at ?? 0).getTime();
                                const bTime = new Date(b.created_at ?? 0).getTime();
                                return aTime - bTime;
                            })
                            .map((pomodolo, index) => (
                                <div>
                                    <HStack key={index} justify="space-between">
                                        <Text onClick={() => {
                                            setSelectedPomodolo(pomodolo)
                                            setIsTimerModalOpen(true)
                                        }}>{pomodolo.title}</Text>
                                        <HStack >
                                            <IconButton
                                                icon={<FiMinus />}
                                                size="sm"
                                                isDisabled={pomodolo.currentSets <= 0}
                                                onClick={() => handleMinusPomodolo(pomodolo.id)}
                                            />

                                            <Text fontSize="sm" color={pomodolo.currentSets >= pomodolo.setNumber ? "green.500" : "gray.500"}>
                                                {pomodolo.currentSets} / {pomodolo.setNumber} セット
                                            </Text>

                                            <IconButton
                                                icon={pomodolo.currentSets >= pomodolo.setNumber ? <FiStar /> : <FiPlus />}
                                                color={pomodolo.currentSets >= pomodolo.setNumber ? "gold" : undefined}
                                                size="sm"
                                                onClick={() => handlePlusPomodolo(pomodolo.id)}
                                            />
                                        </HStack>
                                    </HStack>

                                </div>
                            ))}
                        {pomodolos.length === 0 && (
                            <Text color="gray.500" textAlign="center">
                                ポモドーロを設定してください
                            </Text>
                        )}
                        {pomodolos.length >= 1 && (
                            <Text color="gray.500" textAlign="center">
                                残り所要時間：
                                {(() => {
                                    const totalMinutes = pomodolos.filter(pomodolo => new Date(pomodolo.date).toDateString() === selectedDate.toDateString()).reduce((total, pomodolo) => total + (pomodolo.setNumber - pomodolo.currentSets) * 30, 0);
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    if (totalMinutes < 0) return '0分';
                                    return hours > 0
                                        ? `${hours}時間${minutes > 0 ? ` ${minutes}分` : ''}`
                                        : `${minutes}分`;
                                })()}
                            </Text>
                        )}
                    </VStack>
                </div>
            </div>
            <PomodoloSettingModal
                isOpen={isSettingModalOpen}
                onClose={() => setIsSettingModalOpen(false)}
                onSave={handleSavePomodolo}
                allPomodolos={pomodolos}
                selectedDate={selectedDate}
            />
            <CountdownTimerModal
                isOpen={isTimerModalOpen}
                onClose={() => handleTimerModalClose()}
                pomodoloId={selectedPomodolo?.id || ''}
                pomodoloName={selectedPomodolo?.title || ''}
                finishPomodolo={handlePlusPomodolo}
            ></CountdownTimerModal>


        </>
    );
}

export default PomodoloList