import React, { useState, useEffect } from 'react'
import {
    Box, Text, VStack, CircleProgress, CircleProgressLabel, Button, Modal, ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Flex,
    Select,
    Option,
} from '@yamada-ui/react'

interface CountdownTimerProps {
    isOpen: boolean;
    onClose: () => void;
    pomodoloId: string;
    pomodoloName: string;
    finishPomodolo: any;
}

const CountdownTimerModal: React.FC<CountdownTimerProps> = ({ isOpen, onClose, pomodoloId, pomodoloName, finishPomodolo }) => {
    const [timeLeft, setTimeLeft] = useState(1500)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false);

    const [time, onChange] = useState<string>('1500')

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        setTimeLeft(parseInt(time)); // timeが変更されたときにtimeLeftを更新
    }, [time]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && !hasFinished) {
            setIsActive(false);
            setHasFinished(true); // タイマーが終了したことを記録
            finishPomodolo(pomodoloId);
            onClose();
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, hasFinished])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const handleClose = () => {
        setTimeLeft(1500);
        setIsActive(false);
        onClose();
    };

    const progress = (timeLeft / parseInt(time)) * 100

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>{pomodoloName} </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <VStack>
                    <Select placeholder='時間を選択' value={time.toString()} onChange={onChange}>
                        <Option value='1500'>25分</Option>
                        <Option value='1800'>30分</Option>
                        <Option value='2100'>35分</Option>
                    </Select>
                </VStack>
                <VStack >
                    <Flex justify='center'>
                        <Box position="relative" width="200px" height="200px">
                            <CircleProgress
                                value={progress}
                                size="200px"
                                thickness="4px"
                                color="primary"
                            >
                                <CircleProgressLabel>
                                    <Text fontSize="3xl" fontWeight="bold">
                                        {formatTime(timeLeft)}
                                    </Text>
                                </CircleProgressLabel>                </CircleProgress>
                        </Box>
                    </Flex>
                    <ModalFooter>
                        <Button onClick={toggleTimer}>
                            {isActive ? '一時停止' : '開始'}
                        </Button>
                    </ModalFooter>
                </VStack>
            </ModalBody>
        </Modal>
    )
}

export default CountdownTimerModal

