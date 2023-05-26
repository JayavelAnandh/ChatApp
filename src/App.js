import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatContextProvider from "./chatContext";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="App">
      <ChatContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </ChatContextProvider>
    </div>
  );
}

export default App;
