import { useState, useEffect } from 'react'
import { UIProvider, Button, Input, Card, Modal, ModalBody, ModalHeader, ModalFooter, useDisclosure, VStack, HStack, Text, Heading, Grid, IconButton } from '@yamada-ui/react'
import { Plus, Gift, Trash2, Star } from 'lucide-react'
import { getUserTotalPoints, getUserRewards, addRewardItem, updateUserTotalPoints, deleteRewardItem } from '../utils/supabaseFunction';
import { Reward } from '../type/reward';

export default function Component() {
    const [totalPoints, setTotalPoints] = useState<number>(0)
    const [rewards, setRewards] = useState<Reward[]>([])
    const [newReward, setNewReward] = useState<Reward>({ id: 0, title: '', point: null })
    const { isOpen, onOpen, onClose } = useDisclosure()

    // 初期ロード時にポイント、報酬を取得
    useEffect(() => {
        const fetchPoints = async () => {
            const point = await getUserTotalPoints();
            if (point !== null) {
                setTotalPoints(point);
            }
        };
        const fetchRewards = async () => {
            const rewards = await getUserRewards();
            if (rewards !== null && rewards !== undefined) {
                setRewards(rewards)
                console.log(rewards)
            }
        }
        fetchPoints();
        fetchRewards();

    }, []);


    const handleAddReward = async () => {
        if (newReward.title && newReward.point && newReward.point > 0) {
            setRewards([...rewards, { ...newReward, id: Date.now() }])
            setNewReward({ id: 0, title: '', point: null })
            await addRewardItem(newReward.title, newReward.point)
            onClose()
        }

    }

    const handleRedeemReward = async (reward: Reward) => {
        if (reward.point && totalPoints >= reward.point) {
            const newTotalPoints = totalPoints - reward.point
            setTotalPoints(newTotalPoints)
            await updateUserTotalPoints(newTotalPoints)
        }
    }

    const handleDeleteReward = async (id: number) => {
        await deleteRewardItem(id)
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
                        {rewards.sort((a, b) => (a.point || 0) - (b.point || 0)).map((reward) => (
                            <Card key={reward.id} p={6} shadow="md" _hover={{ shadow: "lg" }} transition="box-shadow 0.3s" bg="white/60" backdropFilter="blur(8px)">
                                <VStack align="stretch" >
                                    <Heading size="md" color="indigo.600">{reward.title}</Heading>
                                    <Text color="gray.600">{reward.point} ポイント</Text>
                                    <HStack justify="space-between">
                                        <Button disabled={reward.point ? totalPoints < reward.point : false} colorScheme="green" onClick={() => handleRedeemReward(reward)} rightIcon={<Gift />}>
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
                                value={newReward.title}
                                onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="消費ポイント数"
                                value={newReward.point || ''}
                                onChange={(e) => setNewReward({ ...newReward, point: parseInt(e.target.value) })}
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