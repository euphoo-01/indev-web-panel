import { useState } from "react";
import "./App.css";
import AuthorizationPage from "./components/AuthorizationPage/authorizationPage";
import MainPage from "./components/MainPage/MainPage";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
	const [page, setPage] = useState("0");
	return (
		<ThemeProvider>
			<AuthProvider>
				<div className="background-elements">
					<div className="circle circle-1"></div>
					<div className="circle circle-2"></div>
					<div className="circle circle-3"></div>
					<div className="circle circle-4"></div>
				</div>
				{page === "0" && <AuthorizationPage pageHandler={setPage} />}
				{page === "1" && <MainPage pageHandler={setPage} />}
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
