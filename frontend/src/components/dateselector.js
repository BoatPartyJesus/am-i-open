import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DateResult from "./dateresult";

const DateSelector = () => {
    const [openDate, setOpenDate] = useState(new Date());
    return (
        <>
            <DatePicker className="picker" showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={openDate} onChange={(date) => setOpenDate(date)} />
            <DateResult date={openDate} />
        </>
    );
};

export default DateSelector;