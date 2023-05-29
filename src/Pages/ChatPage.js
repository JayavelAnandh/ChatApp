import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatStates } from "../chatContext";
import ChatArea from "../components/ChatArea";
import ChatsList from "../components/ChatsList";
import Sidebar from "../components/Sidebar";
import "./chatPage.css";
const ChatPage = () => {
  let user = ChatStates().userDetails;
  let [update, setUpdate] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <Sidebar />}
      <div className="mainBlock">
        {user && <ChatsList update={update} />}
        {user && <ChatArea update={update} setUpdate={setUpdate} />}
      </div>
    </div>
  );
};

export default ChatPage;
