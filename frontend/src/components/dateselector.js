import React, { useState } from "react";
import DatePicker from "react-datepicker";


import "react-datepicker/dist/react-datepicker.css";
import DateResult from "./dateresult";

const DateSelector = () => {
    const [openDate, setOpenDate] = useState(new Date());
    return (
        <div className="picker">
            <DatePicker className="picker-input" showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={openDate} onChange={(date) => setOpenDate(date)} />
            <p className="nowString">{openDate.toString()}</p>
            <DateResult date={openDate} />
        </div>
    );
};

export default DateSelector;