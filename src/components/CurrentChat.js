import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatStates } from "../chatContext";
import { getSender, getSender2, getSenderDetails } from "./commonFunctions";
import GroupDetailsModal from "./GroupDetailsModal";
import ProfileView from "./ProfileView";
import "./CurrentChat.css";
import ScrollableChats from "./ScrollableChats";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const CurrentChat = ({ update, setUpdate }) => {
  const user = ChatStates().userDetails;
  const token = ChatStates().authToken;
  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      let res = await fetch(
        `http://localhost:5000/message/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let response = await res.json();
      setMessages(response);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //notify
      } else {
        setMessages([].concat(...messages, newMessageReceived));
      }
    });
  });
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        let res = await fetch("http://localhost:5000/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        setNewMessage("");
        let response = await res.json();
        socket.emit("new message", response);
        setMessages([].concat(...messages, response));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };
  const typingHandler = (event) => {
    setNewMessage(event.target.value);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "26px", md: "30px" }}
            p={3}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              colorScheme="green"
              aria-label="Search database"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat()}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender2(user, selectedChat.users)}
                <ProfileView user={getSenderDetails(user, selectedChat.users)}>
                  <i className="fa-solid fa-id-card"></i>
                </ProfileView>
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                <GroupDetailsModal
                  update={update}
                  setUpdate={setUpdate}
                  fetchAllMessages={fetchAllMessages}
                />
              </>
            )}
          </Box>
          <Box
            className="chatAreaBG"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              backgroundColor: "gainsboro",
              padding: "8px",
              width: "100%",
              height: "90%",
              borderRadius: "15px",
              msOverflowY: "hidden",
            }}
          >
            {loading ? (
              <iframe
                src="https://embed.lottiefiles.com/animation/88724"
                style={{ width: "100%", height: "100%" }}
              ></iframe>
            ) : (
              <div className="chatMessagesDisplay">
                <ScrollableChats messages={messages} />
                <FormControl
                  onKeyDown={(event) => sendMessage(event)}
                  id="first-name"
                  isRequired
                  mt={3}
                >
                  <Input
                    variant="outline"
                    bg="gainsboro"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={(event) => typingHandler(event)}
                    focusBorderColor="green.600"
                    borderWidth="1.5px"
                    width="100%"
                  />

                  {/* <i
                className="fa-brands fa-telegram fa-2xl"
                style={{ marginLeft: "1%" }}
              ></i> */}
                </FormControl>
              </div>
            )}
          </Box>
        </>
      ) : (
        <Box style={{ height: "100%", width: "100%" }}>
          <Text
            className="beforeSelectingChatGif"
            display="flex"
            justifyContent="center"
            fontSize="30px"
            textDecoration="underline"
            textDecorationColor="green"
            textDecorationThickness="3px"
          >
            Select A Contact To Start Chatting
          </Text>
          <iframe
            src="https://embed.lottiefiles.com/animation/63029"
            style={{ height: "90%", width: "100%" }}
          ></iframe>
        </Box>
      )}
    </>
  );
};

export default CurrentChat;
