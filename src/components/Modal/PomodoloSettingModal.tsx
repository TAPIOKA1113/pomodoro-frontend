import { useState, useEffect } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    VStack,
    Input,
    HStack,
    IconButton,
    NumberInput,
    Text,
    Flex
} from '@yamada-ui/react'
import { Trash2 } from 'lucide-react'
import { Pomodolo } from '../../type/pomodolo';
import { fetchPomodolos, deletePomodoloItem } from '../../utils/supabaseFunction';


interface PomodoloSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: any;
    allPomodolos: any;
    selectedDate: Date;
}

export default function PomodoloSettingModal({ isOpen, onClose, onSave, allPomodolos, selectedDate }: PomodoloSettingModalProps) {

    const [pomodolos, setPomodolos] = useState<Pomodolo[]>([{ id: crypto.randomUUID(), title: '', setNumber: 1, currentSets: 0, date: new Date(), created_at: Date.now() }]);


    useEffect(() => {
        if (isOpen) {
            const filteredPomodolos = allPomodolos.filter((pomodolo: Pomodolo) => {
                const pomodoloDate = new Date(pomodolo.date);
                return pomodoloDate.toDateString() === selectedDate.toDateString();
            });
            console.log(filteredPomodolos);

            setPomodolos([
                ...filteredPomodolos,
                {
                    id: crypto.randomUUID(), title: '', setNumber: 1, currentSets: 0, date: selectedDate, created_at: Date.now()
                }
            ]);
        }
    }, [isOpen, allPomodolos, selectedDate]);

    const handleInputChange = (index: number, value: string) => {
        const newPomodolos = [...pomodolos];
        newPomodolos[index] = { ...newPomodolos[index], title: value };

        if (value === '' && pomodolos[index + 1]?.title === '' && index !== pomodolos.length - 1) {
            newPomodolos.splice(index, 1);
        }

        setPomodolos(newPomodolos);
    };

    const handlePointsChange = (index: number, value: number) => {
        const newPomodolos = [...pomodolos];
        newPomodolos[index] = { ...newPomodolos[index], setNumber: value };
        setPomodolos(newPomodolos);
    };

    const addNewField = (index: number) => {
        const currentValue = pomodolos[index].title;
        if (currentValue !== '' && index === pomodolos.length - 1) {
            setPomodolos([...pomodolos, { id: crypto.randomUUID(), title: '', setNumber: 1, currentSets: 0, date: selectedDate, created_at: Date.now() }]);
        }
    };

    const handleBlur = (index: number) => {
        addNewField(index);
    };


    const handleDelete = async (id: string) => {

        deletePomodoloItem(id);


        // ローカルの状態を更新
        const newPomodolos = pomodolos.filter(pomodolo => pomodolo.id !== id);

        // 全て削除された場合は、空のポモドーロを追加
        if (newPomodolos.length === 0) {
            setPomodolos([{
                id: crypto.randomUUID(),
                title: '',
                setNumber: 1,
                currentSets: 0,
                date: selectedDate,
                created_at: Date.now()
            }]);
            return;
        }

        setPomodolos(newPomodolos);

    };

    const handleCopyButton = async (date: Date) => {

        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - 1);

        const previousPomodolos = await fetchPomodolos(previousDate);

        // 前日のポモドーロを取得し、新しい日付で複製
        // const previousPomodolos = allPomodolos
        //     .filter((pomodolo: Pomodolo) => {
        //         const pomodoloDate = new Date(pomodolo.date);
        //         return pomodoloDate.toDateString() === previousDate.toDateString();
        //     })
        //     .map((pomodolo: Pomodolo) => ({
        //         ...pomodolo,
        //         id: crypto.randomUUID(),
        //         date: selectedDate,
        //         currentSets: 0
        //     }));


        setPomodolos([
            ...(previousPomodolos || []),
            {
                id: crypto.randomUUID(), title: '', setNumber: 1, currentSets: 0, date: selectedDate, created_at: Date.now()
            }
        ]);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>ポモドーロの設定
                <Button onClick={() => handleCopyButton(selectedDate)}>前日の内容をコピー</Button>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack align="stretch">
                    {pomodolos[0].title.trim() !== '' && (

                        <Flex justify="end" fontSize="md" color="gray.500">
                            <Text px="16">
                                セット数
                            </Text>
                        </Flex>

                    )}
                    {pomodolos
                        .sort((a, b) => {
                            // created_atでソート（昇順）
                            const aTime = new Date(a.created_at ?? 0).getTime();
                            const bTime = new Date(b.created_at ?? 0).getTime();
                            return aTime - bTime;
                        })
                        .map((pomodolo, index) => (
                            <HStack key={index} >
                                <Input
                                    data-index={index}
                                    value={pomodolo.title}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onBlur={() => handleBlur(index)}
                                    placeholder="新しいポモドーロを追加"
                                    flex={1}
                                />
                                {pomodolo.title.trim() !== '' && (
                                    <>

                                        <NumberInput
                                            value={pomodolo.setNumber}
                                            onChange={(_, value) => handlePointsChange(index, value)}
                                            min={1}
                                            max={10}
                                            w="100px"
                                            size="md"
                                        >
                                        </NumberInput>

                                        <IconButton
                                            aria-label="習慣を削除"
                                            icon={<Trash2 />}
                                            variant="ghost"
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() => handleDelete(pomodolo.id)}
                                        />
                                    </>
                                )}
                            </HStack>
                        ))}
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button
                    colorScheme="yellow"
                    variant="ghost"
                    onClick={onClose}
                    mr={3}
                >
                    キャンセル
                </Button>
                <Button
                    colorScheme="green"
                    variant="ghost"
                    onClick={() => {
                        const validPomodolos = pomodolos.filter(h => h.title.trim() !== '');
                        onSave(validPomodolos, selectedDate);
                    }}
                >
                    確定
                </Button>
            </ModalFooter>
        </Modal>
    );
}