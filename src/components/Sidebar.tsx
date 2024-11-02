import { Link, useLocation } from 'react-router-dom'
import {
    Button,
    VStack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    IconButton,
} from "@yamada-ui/react"
import { Menu } from "@yamada-ui/lucide"
import { supabase } from '../utils/supabase'
function Sidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const location = useLocation()

    return (
        <>
            <IconButton
                icon={<Menu />}
                onClick={onOpen}
                position="fixed"
                top={4}
                left={4}
                zIndex={2}
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />

                <DrawerHeader borderBottomWidth="1px">ポモドーロ</DrawerHeader>
                <DrawerBody>
                    <VStack align="stretch">
                        <Button
                            as={Link}
                            to="/task"
                            variant={location.pathname === "/task" ? "solid" : "ghost"}
                            justifyContent="flex-start"
                            onClick={onClose}
                        >
                            タスク管理
                        </Button>
                        <Button
                            as={Link}
                            to="/report"
                            variant={location.pathname === "/report" ? "solid" : "ghost"}
                            justifyContent="flex-start"
                            onClick={onClose}
                        >
                            レポート
                        </Button>
                        <Button
                            as={Link}
                            to="/reward"
                            variant={location.pathname === "/reward" ? "solid" : "ghost"}
                            justifyContent="flex-start"
                            onClick={onClose}
                        >
                            ご褒美の使用
                        </Button>
                        <Button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                onClose();
                            }}
                            variant="ghost"
                            justifyContent="flex-start"
                            colorScheme="red"
                        >
                            ログアウト
                        </Button>

                    </VStack>
                </DrawerBody>

            </Drawer>
        </>
    )
}

export default Sidebar