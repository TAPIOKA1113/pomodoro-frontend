import { supabase } from './supabase';
import { Pomodolo } from '../type/pomodolo';
import { Reward } from '../type/reward';

// ポモドーロの取得
export const fetchPomodolos = async (selectedDate: Date) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('pomodolos')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('date', selectedDate.toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching pomodolos:', error);
        return null;
    }

    return data;
};

// ポモドーロの追加
export const addPomodoloItem = async (title: string, setNumber: number, date: Date) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('pomodolos')
        .insert([
            {
                id: crypto.randomUUID(),
                title,
                setNumber,
                currentSets: 0,
                date,
                user_id: session.session.user.id,

            }
        ])
        .select();

    if (error) {
        console.error('Error adding pomodolo:', error);
        return null;
    }

    return data;
};

// ポモドーロの更新
export const updatePomodoloCount = async (id: string, num: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    // まず現在のcurrentSetsの値を取得
    const { data: currentData, error: fetchError } = await supabase
        .from('pomodolos')
        .select('currentSets')
        .eq('id', id)
        .eq('user_id', session.session.user.id)
        .single();

    if (fetchError) {
        console.error('Error fetching current sets:', fetchError);
        return null;
    }

    // currentSetsを更新
    const { data, error } = await supabase
        .from('pomodolos')
        .update({ currentSets: (currentData?.currentSets || 0) + num })
        .eq('id', id)
        .eq('user_id', session.session.user.id);

    if (error) {
        console.error('Error updating pomodolo:', error);
        return null;
    }

    return data;
};

//  報酬の取得
export const getUserRewards = async (): Promise<Reward[]> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return [];

    const { data, error } = await supabase
        .from('rewards')
        .select('id, title, point')
        .eq('user_id', session.session.user.id)

    if (error) {
        console.error('Error fetching pomodolos:', error);
        return [];
        
    }

    return data;
};

// 報酬の追加
export const addRewardItem = async (title: string, point: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('rewards')
        .insert([
            {
                id: crypto.randomUUID(),
                title,
                point,
                user_id: session.session.user.id,
            }
        ])
        .select();

    if (error) {
        console.error('Error adding pomodolo:', error);
        return null;
    }

    return data;
};

// 報酬の削除
export const deleteRewardItem = async (id: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);

    if (error) {
        console.error('Error deleting pomodolo:', error);
        return null;
    }
};


//　総ポイント数の取得
export const getUserTotalPoints = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('users')
        .select('total_points')
        .eq('id', session.session.user.id)
        .single();

    if (error) {
        console.error('Error fetching user points:', error);
        return null;
    }

    return data?.total_points ?? 0;
};

//　総ポイント数の更新
export const updateUserTotalPoints = async (points: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('users')
        .update({ total_points: points })
        .eq('id', session.session.user.id);

    if (error) {
        console.error('Error updating user points:', error);
        return null;
    }

    return data;
};

// ポモドーロの削除
export const deletePomodoloItem = async (id: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { error } = await supabase
        .from('pomodolos')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);

    if (error) {
        console.error('Error deleting pomodolo:', error);
        return null;
    }
};

// 複数のポモドーロの保存
export const savePomodolos = async (pomodolos: Pomodolo[]) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const pomodolosWithUserId = pomodolos.map(pomodolo => ({
        ...pomodolo,
        user_id: session.session!.user.id
    }));

    const { data, error } = await supabase
        .from('pomodolos')
        .upsert(pomodolosWithUserId);

    if (error) {
        console.error('Error saving pomodolos:', error);
        return null;
    }

    return data;
};