import React, {useEffect, useState} from "react";
import {isBefore} from 'date-fns';
import DateCard from './datecard'

var date_sort_asc = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
};

const ClosedDateTimeline = () => {

    const [dates, setDates] = useState([]);

    const now = new Date();

    useEffect(() => {
        fetch(`http://localhost:3001/closed`, {mode: 'cors'})
            .then(res => res.json())
            .then(result => setDates(result));
    })

    let closedDates = dates.map((dt) => new Date(dt));

    return(
        <div className="timeline">
            <h2>Closed Dates</h2>
            {
                closedDates.sort(date_sort_asc).map((date, index) => <DateCard relativity={isBefore(date, now) ? "past" : "future"} key={index} date={date} />)
            }
        </div>
    )
}

export default ClosedDateTimeline;