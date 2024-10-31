import { DatePicker } from '@yamada-ui/calendar';


function Report() {

    return (
        <>
            <h1>レポート</h1>
            <DatePicker placeholder="日付を選択" onChange={(date) => console.log(date)} />
        </>
    );
}

export default Report;