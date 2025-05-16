import classes from "./button.module.css"

export default function Button({text, clickHandler, addClasses}) {
     let inputClass = classes.input_module;
        inputClass += addClasses ? " " + addClasses : "";
    return(
        <button className={classes.button} onClick={clickHandler}>{text}</button>
    ) 
};

