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

interface Habit {
    title: string;
    setNumber: number;
    currentSets: number;
    date: Date;
}

interface HabitSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: any;
    initialHabits: any;
}

export default function PomodoloSettingModal({ isOpen, onClose, onSave, initialHabits }: HabitSettingModalProps) {

    const [pomodolos, setPomodolos] = useState<Habit[]>([{ title: '', setNumber: 1, currentSets: 0, date: new Date() }]);


    useEffect(() => {
        if (isOpen) {
            setPomodolos([...initialHabits, { title: '', setNumber: 1, currentSets: 0, date: new Date() }]); // 既に存在する習慣に、空の習慣を追加することでテキストボックスを表示
        }
    }, [isOpen, initialHabits]);

    const handleInputChange = (index: number, value: string) => {
        const newHabits = [...pomodolos];
        newHabits[index] = { ...newHabits[index], title: value };

        if (value === '' && pomodolos[index + 1]?.title === '' && index !== pomodolos.length - 1) {
            newHabits.splice(index, 1);
        }

        setPomodolos(newHabits);
    };

    const handlePointsChange = (index: number, value: number) => {
        const newHabits = [...pomodolos];
        newHabits[index] = { ...newHabits[index], setNumber: value };
        setPomodolos(newHabits);
    };

    const addNewField = (index: number) => {
        const currentValue = pomodolos[index].title;
        if (currentValue !== '' && index === pomodolos.length - 1) {
            setPomodolos([...pomodolos, { title: '', setNumber: 1, currentSets: 0, date: new Date() }]);
        }
    };

    const handleBlur = (index: number) => {
        addNewField(index);
    };


    const handleDelete = (index: number) => {
        if (pomodolos.length === 1) {
            setPomodolos([{ title: '', setNumber: 1, currentSets: 0, date: new Date() }]);
            return;
        }
        const newHabits = pomodolos.filter((_, i) => i !== index);
        setPomodolos(newHabits);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>ポモドーロの設定</ModalHeader>
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
                    {pomodolos.map((habit, index) => (
                        <HStack key={index} >
                            <Input
                                data-index={index}
                                value={habit.title}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onBlur={() => handleBlur(index)}
                                placeholder="新しいポモドーロの追加"
                                flex={1}
                            />
                            {habit.title.trim() !== '' && (
                                <>

                                    <NumberInput
                                        value={habit.setNumber}
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
                                        onClick={() => handleDelete(index)}
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
                        onSave(validPomodolos);
                    }}
                >
                    確定
                </Button>
            </ModalFooter>
        </Modal>
    );
}