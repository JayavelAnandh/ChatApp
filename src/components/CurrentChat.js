import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { ChatStates } from "../chatContext";
import { getSender, getSender2 } from "./commonFunctions";

const CurrentChat = ({ update, setUpdate }) => {
  const user = ChatStates().userDetails;
  const token = ChatStates().authToken;
  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();

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
            />
            {!selectedChat.isGroupChat ? (
              <>{getSender2(user, selectedChat.users)}</>
            ) : (
              <Text>{selectedChat.chatName.toUpperCase()}</Text>
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
