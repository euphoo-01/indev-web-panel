import classes from "./room.module.css";

export default function Room({number, has_access, features, price, handler}) {
    
    return(
        <div className={classes.room}>
            <span className={classes.room_number}>{number}</span>
        </div>
    )
};
