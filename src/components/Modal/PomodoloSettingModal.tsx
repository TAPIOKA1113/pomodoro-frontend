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

interface Pomodolo {
    title: string;
    setNumber: number;
    currentSets: number;
    date: Date;
}

interface PomodoloSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: any;
    initialHabits: any;
    selectedDate: Date;
}

export default function PomodoloSettingModal({ isOpen, onClose, onSave, initialHabits, selectedDate }: PomodoloSettingModalProps) {

    const [pomodolos, setPomodolos] = useState<Pomodolo[]>([{ title: '', setNumber: 1, currentSets: 0, date: new Date() }]);


    useEffect(() => {
        if (isOpen) {
            const filteredHabits = initialHabits.filter((pomodolo: Pomodolo) => {
                const pomodoloDate = new Date(pomodolo.date);
                return pomodoloDate.toDateString() === selectedDate.toDateString();
            });
            console.log(filteredHabits);

            setPomodolos([
                ...filteredHabits,
                { title: '', setNumber: 1, currentSets: 0, date: selectedDate }
            ]);
        }
    }, [isOpen, initialHabits, selectedDate]);

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
        const newPomodolos = pomodolos.filter((_, i) => i !== index);
        setPomodolos(newPomodolos);
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
                    {pomodolos.map((pomodolo, index) => (
                        <HStack key={index} >
                            <Input
                                data-index={index}
                                value={pomodolo.title}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onBlur={() => handleBlur(index)}
                                placeholder="新しいポモドーロの追加"
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