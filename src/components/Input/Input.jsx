import "./Input.css";

export default function Input({ 
  className, 
  inputPlaceholder, 
  name, 
  type = "text", 
  value, 
  onChange,
  required
}) {
  return (
    <div className="input-wrapper">
      <input
        placeholder={inputPlaceholder}
        className={`input-field ${className || ""}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
