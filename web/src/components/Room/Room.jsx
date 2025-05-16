import classes from "./room.module.css";

export default function Room({ number, has_access, features, price, handler }) {
  return (
    <div
      className={classes.room}
      onClick={() => {
        handler({ number, has_access, features, price });
      }}
    >
      <span className={classes.room_number}>{number}</span>
    </div>
  );
}
