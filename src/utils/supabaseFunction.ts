import { supabase } from './supabase';
import { Pomodolo } from '../type/pomodolo';

// ポモドーロの取得
export const fetchPomodolos = async (selectedDate: Date) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data, error } = await supabase
        .from('Pomodolos')
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
        .from('Pomodolos')
        .insert([
            {
                title,
                setNumber,
                currentSets: 0,
                date,
                user_id: session.session.user.id,
                id: crypto.randomUUID()
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
export const updateSetPomodolo = async (id: string, num: number) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    // まず現在のcurrentSetsの値を取得
    const { data: currentData, error: fetchError } = await supabase
        .from('Pomodolos')
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
        .from('Pomodolos')
        .update({ currentSets: (currentData?.currentSets || 0) + num })
        .eq('id', id)
        .eq('user_id', session.session.user.id);

    if (error) {
        console.error('Error updating pomodolo:', error);
        return null;
    }

    return data;
};

// ポモドーロの削除
export const deletePomodoloItem = async (id: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { error } = await supabase
        .from('Pomodolos')
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
        .from('Pomodolos')
        .upsert(pomodolosWithUserId);

    if (error) {
        console.error('Error saving pomodolos:', error);
        return null;
    }

    return data;
};