import React, { useState } from "react";

const DateResult = ({date}) => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")

    fetch(`http://localhost:3001/open?date=` + date.toISOString(), {mode: 'cors'})
        .then(res => res.json())
        .then(result => {setOpen(result.isOpen); setMessage(result.message);});

    let openString = open === true ? "OPEN" : "CLOSED";

    return (
        <>
            <h1>We are currently: {openString}</h1>
            <h2>{message}</h2>
        </>
    );
};

export default DateResult;