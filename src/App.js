import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
