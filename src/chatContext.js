import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState();
  const [userDetails, setUserDetails] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();

  let navigate = useNavigate();

  useEffect(() => {
    let localStorageUserDetails = JSON.parse(
      localStorage.getItem("user-details")
    );
    let localStorageAuthToken = localStorage.getItem("x-auth-token");
    setAuthToken(localStorageAuthToken);
    setUserDetails(localStorageUserDetails);
    if (!localStorageUserDetails) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        userDetails,
        setUserDetails,
        authToken,
        setAuthToken,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatStates = () => {
  return useContext(ChatContext);
};
export default ChatContextProvider;
