import Input from "../Input/Input";
import classes from "./AuthorizationPage.module.css";
import Button from "../Button/Button";
export default function AuthorizationPage({ pageHandler }) {
  const Login = () => {
    alert("Successfully");
    pageHandler("1");
  };

  return (
    <>
      <h1 className="header">Вход</h1>
      <div className={classes.authorization_inputs}>
        <Input name={"auth_login"} inputPlaceholder={"Логин"} />
        <Input name={"auth_pass"} inputPlaceholder={"Пароль"} />
      </div>
      <Button clickHandler={Login} text={"Войти"}></Button>
    </>
  );
}
