import { supabase } from './supabase';
import { Pomodolo } from '../type/pomodolo';

export const fetchPomodolos = async ( selectedDate: Date) => {
    // 日付をYYYY-MM-DD形式に変換
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(formattedDate);

    const { data, error } = await supabase
        .from('Pomodolos')
        .select('*')
        .eq('date', formattedDate);

    console.log(data);

    if (error) {
        console.error('Error fetching pomodolos:', error);
        return;
    }

    return data;
    // setPomodolos(data || []);
};

export const addPomodoloItem = async (title: string, setNumber: number, selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];

    const { data, error } = await supabase.from('Pomodolos').insert({
        id: crypto.randomUUID(),
        title: title,
        setNumber: setNumber,
        currentSets: 0,
        date: formattedDate
    });

    if (error) {
        console.error('Error adding pomodolo:', error);
        return null;
    }

    return data;
};

export const deletePomodoloItem = async (id: string) => {
    await supabase.from('Pomodolos').delete().eq('id', id);
};

export const checkPomodoloItem = async (id: number, status: boolean) => {
    await supabase.from('Pomodolos').update({ status: !status }).eq('id', id);
};

export const updateSetPomodolo = async (id: string, num: number) => {
    // まず現在のcurrentSetsの値を取得
    const { data: currentData, error: fetchError } = await supabase
        .from('Pomodolos')
        .select('currentSets')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error('Error fetching current sets:', fetchError);
        return null;
    }

    // currentSetsを+1して更新
    const { data, error } = await supabase
        .from('Pomodolos')
        .update({ currentSets: (currentData?.currentSets || 0) + num })
        .eq('id', id);

    if (error) {
        console.error('Error updating pomodolo:', error);
        return null;
    }

    return data;
};



export const savePomodolos = async (pomodolos: Pomodolo[]) => {
    const { data, error } = await supabase
        .from('Pomodolos')
        .upsert(pomodolos);

    if (error) {
        console.error('Error saving pomodolos:', error);
        return null;
    }

    return data;
};