import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatStates } from "../chatContext";
import CurrentChat from "./CurrentChat";

const ChatArea = ({ update, setUpdate }) => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "68%" }}
      style={{
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "12px",
        borderWidth: "3px",
        padding: "5px",
      }}
    >
      <CurrentChat update={update} setUpdate={setUpdate} />
    </Box>
  );
};

export default ChatArea;
