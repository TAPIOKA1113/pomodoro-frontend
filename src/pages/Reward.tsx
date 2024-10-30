import { useState, useEffect } from 'react'
import { UIProvider, Button, Input, Card, Modal, ModalBody, ModalHeader, ModalFooter, useDisclosure, VStack, HStack, Text, Heading, Grid, IconButton } from '@yamada-ui/react'
import { Plus, Gift, Trash2, Star } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage';

interface Reward {
    id: number;
    name: string;
    points: number | null;
}

export default function Component() {
    const [totalPoints, setTotalPoints] = useState<number>(0)
    const [rewards, setRewards] = useLocalStorage<Reward[]>("rewards", [])
    const [newReward, setNewReward] = useState<Reward>({ id: 0, name: '', points: null })
    const { isOpen, onOpen, onClose } = useDisclosure()

    // 初回レンダリング時に保有ポイント、報酬を読み込む
    useEffect(() => {
        const storedPoints = localStorage.getItem('totalPoints')
        if (storedPoints) setTotalPoints(parseInt(storedPoints))

        const storedRewards = localStorage.getItem('rewards')
        if (storedRewards) setRewards(JSON.parse(storedRewards))
    }, [])

    // 報酬が更新されたらローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('rewards', JSON.stringify(rewards))
    }, [rewards])

    const handleAddReward = () => {
        if (newReward.name && newReward.points && newReward.points > 0) {
            setRewards([...rewards, { ...newReward, id: Date.now() }])
            setNewReward({ id: 0, name: '', points: null })
            onClose()
        }
    }

    const handleRedeemReward = (reward: Reward) => {
        if (reward.points && totalPoints >= reward.points) {
            setTotalPoints(totalPoints - reward.points)
            localStorage.setItem('totalPoints', (totalPoints - reward.points).toString())
        }
    }

    const handleDeleteReward = (id: number) => {
        setRewards(rewards.filter(reward => reward.id !== id))
    }

    return (
        <UIProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 p-8">
                <Card className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm shadow-xl p-8">
                    <Heading size="2xl" className="text-center text-indigo-700 mb-8">Reward System</Heading>
                    <HStack justify="space-between" mb={8}>
                        <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                            <Star className="text-yellow-400 w-6 h-6" />
                            <span className="text-2xl font-bold text-indigo-700">{totalPoints}</span>
                            <span className="text-lg font-semibold text-indigo-600">Pt</span>
                        </div>
                        <Button colorScheme="indigo" onClick={onOpen} leftIcon={<Plus />}>
                            ご褒美の追加
                        </Button>
                    </HStack>
                    <Grid gap={6}>
                        {rewards.map((reward) => (
                            <Card key={reward.id} p={6} shadow="md" _hover={{ shadow: "lg" }} transition="box-shadow 0.3s" bg="white/60" backdropFilter="blur(8px)">
                                <VStack align="stretch" >
                                    <Heading size="md" color="indigo.600">{reward.name}</Heading>
                                    <Text color="gray.600">{reward.points} ポイント</Text>
                                    <HStack justify="space-between">
                                        <Button colorScheme="green" onClick={() => handleRedeemReward(reward)} leftIcon={<Gift />}>
                                            使用
                                        </Button>
                                        <IconButton
                                            aria-label="Delete reward"
                                            icon={<Trash2 />}
                                            colorScheme="red"
                                            variant="outline"
                                            onClick={() => handleDeleteReward(reward.id)}
                                        />
                                    </HStack>
                                </VStack>
                            </Card>
                        ))}
                    </Grid>
                </Card>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalHeader>ご褒美の追加</ModalHeader>
                    <ModalBody>
                        <VStack >
                            <Input
                                placeholder="内容"
                                value={newReward.name}
                                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="消費ポイント数"
                                value={newReward.points || ''}
                                onChange={(e) => setNewReward({ ...newReward, points: parseInt(e.target.value) })}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>キャンセル</Button>
                        <Button colorScheme="indigo" mr={3} onClick={handleAddReward}>
                            追加
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </UIProvider>
    )
}