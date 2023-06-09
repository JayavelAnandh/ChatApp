import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
//import axios from "axios";
import { useEffect, useState } from "react";
//import { getSender } from "../config/ChatLogics";
//import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatStates } from "../chatContext";
import { getSender2 } from "./commonFunctions";
import GroupChatModal from "./GroupChatModal";
//import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ update }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();
  const user = ChatStates().userDetails;
  const toast = useToast();
  const token = localStorage.getItem("x-auth-token");
  const fetchChats = async () => {
    try {
      let res = await fetch("https://voluble.onrender.com/chat/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let response = await res.json();
      setChats(response);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user-details")));
    fetchChats();
    // eslint-disable-next-line
  }, [update]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            // rightIcon={<AddIcon />}
          >
            New Group Chat{" "}
            <i class="fa-solid fa-user-group" style={{ margin: "5px" }}></i>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat, idx) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={idx}
              >
                {chat.users && (
                  <>
                    {!chat.isGroupChat
                      ? getSender2(user, chat.users)
                      : chat.chatName}
                  </>
                )}

                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <iframe src="https://embed.lottiefiles.com/animation/98112"></iframe>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
