import { useState } from "react";
import "./App.css";
import AuthorizationPage from "./components/AuthorizationPage/authorizationPage";
import MainPage from "./components/MainPage/MainPage";

function App() {
  const [page, setPage] = useState("0");
  return (
    <>
      {page === "0" && <AuthorizationPage pageHandler={setPage} />}
      {page === "1" && <MainPage pageHandler={setPage}/>}
    </>
  );
}

export default App;
