import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
    // 最終更新日を取得する関数
    const getStoredValue = (storageKey: string, defaultValue: any) => {
        try {
            const item = window.localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(error);
            return defaultValue;
        }
    };


    // 保存する値の状態
    const [storedValue, setStoredValue] = useState<T>(() =>
        getStoredValue(key, initialValue)
    );

    // 値を設定し、LocalStorageに保存する関数
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };


    // 値が変更されたらLocalStorageに保存
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue] as const;
}

export default useLocalStorage;