import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  FormControl,
  Input,
  Toast,
  useToast,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { ChatStates } from "../chatContext";
import SelectedusersDisplay from "./SelectedusersDisplay";

const GroupDetailsModal = ({ update, setUpdate, fetchAllMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = ChatStates().userDetails;
  const token = ChatStates().authToken;
  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  let toast = useToast();

  const removeUser = async (userId) => {
    if (selectedChat.groupAdmin._id !== user._id && userId !== user._id) {
      return toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      setLoading(true);
      let res = await fetch("https://voluble.onrender.com/chat/removeMember", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userId,
        }),
      });
      let response = await res.json();
      userId === user._id ? setSelectedChat() : setSelectedChat(response);
      setUpdate(!update);
      fetchAllMessages();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };

  const AddUser = async (userId) => {
    if (selectedChat.users.find((u) => u._id === userId)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add members to the group !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      let res = await fetch("https://voluble.onrender.com/chat/addMember", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userId,
        }),
      });
      let response = await res.json();
      setSelectedChat(response);
      setUpdate(!update);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setLoading(false);
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      let res = await fetch("https://voluble.onrender.com/chat/renameGroup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          chatName: groupChatName,
        }),
      });
      let response = await res.json();

      setSelectedChat(response);
      setUpdate(!update);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    setRenameLoading(false);
    setGroupChatName("");
  };
  ////////////////////////////////////////
  const handleSearch = async (searchQueries) => {
    setSearch(searchQueries);
    try {
      if (!search) {
        return toast({
          title: "Empty Search Bar",
          description: "Enter name or email to search",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }

      setLoading(true);

      let res = await fetch(
        `https://voluble.onrender.com/user/all?search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let response = await res.json();

      setSearchResult(response);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <i class="fa-solid fa-id-card" onClick={onOpen}></i>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInRight"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                padding: "3px",
              }}
            >
              {selectedChat.users.map((user, idx) => {
                return (
                  <SelectedusersDisplay
                    key={idx}
                    user={user}
                    handleFunction={() => removeUser(user._id)}
                  />
                );
              })}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={() => handleRename()}
              >
                Update{" "}
                <i class="fa-solid fa-gear" style={{ marginLeft: "5px" }}></i>
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <iframe
                src="https://embed.lottiefiles.com/animation/95608"
                style={{ width: "100%" }}
              ></iframe>
            ) : (
              searchResult?.map((user, idx) => (
                <Box
                  key={idx}
                  onClick={() => AddUser(user._id)}
                  cursor="pointer"
                  bg="#E8E8E8"
                  _hover={{
                    background: "#38B2AC",
                    color: "white",
                  }}
                  w="100%"
                  display="flex"
                  alignItems="center"
                  color="black"
                  px={3}
                  py={2}
                  mb={2}
                  borderRadius="lg"
                >
                  <Avatar
                    mr={2}
                    size="lg"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                  />
                  <Box>
                    <Text fontSize="xl">{user.name}</Text>
                    <Text fontSize="sm">
                      <b>Email : </b>
                      {user.email}
                    </Text>
                  </Box>
                </Box>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => removeUser(user._id)}
            >
              Leave Group{" "}
              <i
                class="fa-solid fa-arrow-right-from-bracket"
                style={{ marginLeft: "5px" }}
              ></i>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupDetailsModal;
