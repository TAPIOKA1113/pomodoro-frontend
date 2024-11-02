import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Button, Input, VStack, Text, useNotice } from '@yamada-ui/react';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const notice = useNotice();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                notice({
                    title: "確認メールを送信しました",
                    description: "メールを確認して登録を完了してください",
                    status: "success"
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error: any) {
            notice({
                title: "エラーが発生しました",
                description: error.message,
                status: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-300">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <form onSubmit={handleAuth}>
                    <VStack >
                        <Text fontSize="2xl" fontWeight="bold">
                            {isSignUp ? "新規登録" : "ログイン"}
                        </Text>
                        <Input
                            type="email"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={loading}
                            w="full"
                        >
                            {isSignUp ? "登録" : "ログイン"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsSignUp(!isSignUp)}
                            w="full"
                        >
                            {isSignUp ? "ログインへ" : "新規登録へ"}
                        </Button>
                    </VStack>
                </form>
            </div>
        </div>
    );
}