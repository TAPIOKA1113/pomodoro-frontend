import React, { useState, useEffect } from 'react'
import { Box, Text, VStack, CircleProgress, CircleProgressLabel, Button, Modal } from '@yamada-ui/react'

interface CountdownTimerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: any;
    initialTime: number // 初期時間（秒）
}

const CountdownTimerModal: React.FC<CountdownTimerProps> = ({ isOpen, initialTime }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(initialTime)
    }

    const progress = (timeLeft / initialTime) * 100

    return (
        <Modal isOpen={isOpen}>
            <VStack >
                <Box position="relative" width="200px" height="200px">
                    <CircleProgress
                        value={progress}
                        size="200px"
                        thickness="4px"
                        color="primary"
                    >
                        <CircleProgressLabel>
                            <Text fontSize="3xl" fontWeight="bold">
                                {timeLeft}s
                            </Text>
                        </CircleProgressLabel>                </CircleProgress>
                </Box>
                <Button onClick={toggleTimer}>
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer}>Reset</Button>
            </VStack>
        </Modal>
    )
}

export default CountdownTimerModal

