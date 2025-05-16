import "./Button.css";

export default function Button({
  text,
  clickHandler,
  className,
  type = "button",
  disabled = false,
  variant = "primary"
}) {
  return (
    <button 
      className={`button ${variant} ${className || ""}`}
      onClick={clickHandler}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

