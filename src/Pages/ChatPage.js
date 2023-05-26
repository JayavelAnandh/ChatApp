import React, { useEffect, useState } from "react";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const getChats = async () => {
    try {
      let res = await fetch("http://localhost:5000/chats", {
        method: "GET",
      });
      let response = await res.json();
      console.log(response);
      setChats(response);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getChats();
  // }, []);

  return (
    <div>
      {chats.map((value, idx) => {
        return <div key={idx}>{value.chatName}</div>;
      })}
    </div>
  );
};

export default ChatPage;
