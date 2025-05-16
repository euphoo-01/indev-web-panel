import classes from "./Input.module.css";

export default function Input({ addClasses, inputPlaceholder, name }) {
    let inputClass = classes.input_module;
    inputClass += addClasses ? " " + addClasses : "";
  return (
    <input
      placeholder={inputPlaceholder}
      className={inputClass}
      name={name}
    />
  );
}
