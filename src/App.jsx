import { useState, useEffect } from "react";
import "./App.css";
import AuthorizationPage from "./components/AuthorizationPage/authorizationPage";
import MainPage from "./components/MainPage/MainPage";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Функция для проверки наличия токена в localStorage
const hasJwtToken = () => {
	return !!localStorage.getItem('jwt_token');
};

function App() {
	// Изначально устанавливаем страницу в зависимости от наличия токена
	const [page, setPage] = useState(hasJwtToken() ? "1" : "0");

	// Также реагируем на изменения localStorage в других вкладках или через console
	useEffect(() => {
		// Проверяем токен при загрузке
		console.log("App initialized, token exists:", hasJwtToken());

		// Функция для обработки изменений localStorage между вкладками
		const handleStorageChange = () => {
			const hasToken = hasJwtToken();
			console.log("Storage changed, token exists:", hasToken);
			setPage(hasToken ? "1" : "0");
		};

		// Подписываемся на изменения хранилища
		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	return (
		<ThemeProvider>
			<AuthProvider>
				{/* <div className="background-elements">
					<div className="circle circle-1"></div>
					<div className="circle circle-2"></div>
					<div className="circle circle-3"></div>
					<div className="circle circle-4"></div>
				</div> */}
				{page === "0" && <AuthorizationPage pageHandler={setPage} />}
				{page === "1" && <MainPage pageHandler={setPage} />}
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
