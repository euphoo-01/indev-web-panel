import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./AuthorizationPage.css";

export default function AuthorizationPage({ pageHandler }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (name, value) => {
    setCredentials({ ...credentials, [name]: value });
    if (error) setError("");
  };

  const handleLogin = () => {
    if (!credentials.login || !credentials.password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    // Выполняем вход через систему аутентификации
    const result = login(credentials.login, credentials.password);
    
    if (result.success) {
      pageHandler("1");
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button 
        className="theme-toggle auth-theme-toggle" 
        onClick={toggleTheme}
        title={isDarkMode ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
      
      <div className="auth-card">
        <div className="auth-header">
          <h1>InDev Hotel</h1>
          <p>Панель управления отелем</p>
        </div>

        <div className="auth-form">
          <h2>Вход в систему</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-inputs">
            <Input 
              name="login" 
              inputPlaceholder="Логин" 
              onChange={(e) => handleInputChange("login", e.target.value)} 
              value={credentials.login}
            />
            <Input 
              name="password" 
              inputPlaceholder="Пароль" 
              type="password"
              onChange={(e) => handleInputChange("password", e.target.value)} 
              value={credentials.password}
            />
          </div>
          
          <Button 
            clickHandler={handleLogin} 
            text={isLoading ? "Загрузка..." : "Войти"}
            disabled={isLoading}
            className="login-button"
            variant="success"
          />
          
          <div className="auth-demo-credentials">
            <p>Демо аккаунты:</p>
            <div className="demo-accounts">
              <div className="demo-account">
                <span className="account-role">Root</span>
                <span className="account-login">root / root123</span>
              </div>
              <div className="demo-account">
                <span className="account-role">Admin</span>
                <span className="account-login">admin / admin123</span>
              </div>
              <div className="demo-account">
                <span className="account-role">Employee</span>
                <span className="account-login">employee / emp123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <p>© 2025 InDev Hotel Management System</p>
        </div>
      </div>
    </div>
  );
}
