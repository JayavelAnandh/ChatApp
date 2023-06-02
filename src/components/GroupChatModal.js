import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatStates } from "../chatContext";
import "./GroupChatModal.css";
import SelectedusersDisplay from "./SelectedusersDisplay";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const user = ChatStates().userDetails;
  const { selectedChat, setSelectedChat, chats, setChats } = ChatStates();
  const token = ChatStates().authToken;
  const handleSearch = async (queryPattern) => {
    setSearch(queryPattern);
    if (!queryPattern) {
      return;
    }
    try {
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
        description: "Failed to generate Search Result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      if (!groupChatName || !selectedUsers) {
        return toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      let usersIdArray = JSON.stringify(
        selectedUsers.map((u) => {
          return u._id;
        })
      );

      let res = await fetch("https://voluble.onrender.com/chat/newGroup", {
        method: "POST",
        body: JSON.stringify({
          name: groupChatName,
          users: usersIdArray,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let response = await res.json();
      setChats([].concat(response, ...chats));
      onClose();
      toast({
        title: `Successfully created ${response.chatname}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      return toast({
        title: "Error Creating the group!",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleGroup = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([].concat(...selectedUsers, user));
    } else {
      return toast({
        title: "Error Occured!",
        description: "User already selected",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((users) => users._id !== user._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent className="groupModalContent">
          <ModalHeader className="groupModalhead">
            Create a new Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="groupModalBody">
            <FormControl>
              <Input
                placeholder="Name your group"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl colorScheme="green">
              <Input
                placeholder="Add Users eg : Goku,Vegeta,Beerus"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                colorScheme="green"
              />
            </FormControl>
            <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
              {selectedUsers &&
                selectedUsers.map((user, idx) => {
                  return (
                    <SelectedusersDisplay
                      key={idx}
                      user={user}
                      handleFunction={() => handleDelete(user)}
                    />
                  );
                })}
            </div>
            {loading ? (
              <iframe src="https://embed.lottiefiles.com/animation/99602"></iframe>
            ) : (
              searchResult?.slice(0, 4).map((user, idx) => (
                <Box
                  key={idx}
                  onClick={() => handleGroup(user)}
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
            <Button colorScheme="green" mr={3} onClick={() => handleSubmit()}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
