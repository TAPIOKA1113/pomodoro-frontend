import React, { useState, useEffect } from 'react'
import {
    Box, Text, VStack, CircleProgress, CircleProgressLabel, Button, Modal, ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Flex
} from '@yamada-ui/react'

interface CountdownTimerProps {
    isOpen: boolean;
    onClose: () => void;
    initTime: number
    pomodoloId: string;
    finishPomodolo: any;
}

const CountdownTimerModal: React.FC<CountdownTimerProps> = ({ isOpen, onClose, initTime, pomodoloId, finishPomodolo }) => {
    const [timeLeft, setTimeLeft] = useState(initTime)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false);


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

    const progress = (timeLeft / initTime) * 100

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>タイマー </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
                                        {timeLeft} s
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

