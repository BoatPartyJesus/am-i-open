import React from "react";

const DateCard = ({date, relativity}) => {
    return(
        <div className={"datecard datecard-" + relativity}>{date.toDateString()}</div>
    )
}

export default DateCard;

