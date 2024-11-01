import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ja';

// プラグインを設定
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ja');

// デフォルトのタイムゾーンを設定
dayjs.tz.setDefault('Asia/Tokyo');

export const getJSTDate = () => {
    return dayjs().tz().toDate();
};

export const addDays = (date: Date, days: number) => {
    return dayjs(date).tz().add(days, 'day').toDate();
};

export const subtractDays = (date: Date, days: number) => {
    return dayjs(date).tz().subtract(days, 'day').toDate();
};

export const isSameDate = (date1: Date, date2: Date) => {
    return dayjs(date1).tz().isSame(dayjs(date2).tz(), 'day');
};

export const formatDate = (date: Date) => {
    return dayjs(date).tz().format('YYYY/MM/DD');
};