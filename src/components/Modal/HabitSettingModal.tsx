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
import { Habit } from '../../type/habit';


interface HabitSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (habits: Habit[]) => void;
    initialHabits: Habit[];
}

export default function HabitSettingModal({ isOpen, onClose, onSave, initialHabits }: HabitSettingModalProps) {

    const [habits, setHabits] = useState<Habit[]>([{ title: '', points: 1, isCompleted: false, completedDates: [] }]);


    useEffect(() => {
        if (isOpen) {
            setHabits([...initialHabits, { title: '', points: 1, isCompleted: false, completedDates: [] }]); // 既に存在する習慣に、空の習慣を追加することでテキストボックスを表示
        }
    }, [isOpen, initialHabits]);

    const handleInputChange = (index: number, value: string) => {
        const newHabits = [...habits];
        newHabits[index] = { ...newHabits[index], title: value };

        if (value === '' && habits[index + 1]?.title === '' && index !== habits.length - 1) {
            newHabits.splice(index, 1);
        }

        setHabits(newHabits);
    };

    const handlePointsChange = (index: number, value: number) => {
        const newHabits = [...habits];
        newHabits[index] = { ...newHabits[index], points: value };
        setHabits(newHabits);
    };

    const addNewField = (index: number) => {
        const currentValue = habits[index].title;
        if (currentValue !== '' && index === habits.length - 1) {
            setHabits([...habits, { title: '', points: 1, isCompleted: false, completedDates: [] }]);
        }
    };

    const handleBlur = (index: number) => {
        addNewField(index);
    };


    const handleDelete = (index: number) => {
        if (habits.length === 1) {
            setHabits([{ title: '', points: 1, isCompleted: false, completedDates: [] }]);
            return;
        }
        const newHabits = habits.filter((_, i) => i !== index);
        setHabits(newHabits);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>日々の習慣を設定</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack align="stretch">
                    {habits[0].title.trim() !== '' && (

                        <Flex justify="end" fontSize="md" color="gray.500">
                            <Text px="15">
                                ポイント数
                            </Text>
                        </Flex>

                    )}
                    {habits.map((habit, index) => (
                        <HStack key={index} >
                            <Input
                                data-index={index}
                                value={habit.title}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onBlur={() => handleBlur(index)}
                                placeholder="新しい習慣を入力"
                                flex={1}
                            />
                            {habit.title.trim() !== '' && (
                                <>

                                    <NumberInput
                                        value={habit.points}
                                        onChange={(_, value) => handlePointsChange(index, value)}
                                        min={0}
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
                        const validHabits = habits.filter(h => h.title.trim() !== '');
                        onSave(validHabits);
                    }}
                >
                    確定
                </Button>
            </ModalFooter>
        </Modal>
    );
}