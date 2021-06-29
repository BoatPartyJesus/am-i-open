import React, {useEffect, useState} from "react";

const DateResult = ({date}) => {

    const [open, setOpen] = useState({
        isOpen: false,
        message: ""
    });

    useEffect(() => {
        fetch(`http://localhost:3001/open?date=` + date.toISOString(), {mode: 'cors'})
            .then(res => res.json())
            .then(result => setOpen({isOpen: result.isOpen, message: result.message}));
    },[date]);

    return (
        <>
            <h1>We are currently: {open.isOpen === true ? "OPEN" : "CLOSED"}</h1>
            <h2>{open.message}</h2>
        </>
    );
};

export default DateResult;