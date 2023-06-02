import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { ChatStates } from "../chatContext";
import { getSender2 } from "./commonFunctions";
import ProfileView from "./ProfileView";
import "./sidebar.css";
const Sidebar = () => {
  let navigate = useNavigate();
  let toast = useToast();
  let [search, setSearch] = useState("");
  let [searchResult, setSearchResult] = useState();
  let [loading, setLoading] = useState(false);
  let [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let user = ChatStates().userDetails;
  let {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatStates();

  const logOutMethod = () => {
    localStorage.removeItem("user-details");
    localStorage.removeItem("x-auth-token");
    navigate("/");
  };
  let token = localStorage.getItem("x-auth-token");

  const handleSearch = async () => {
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
        `https://voluble.vercel.app/user/all?search=${search}`,
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      let data = await fetch(`https://voluble.vercel.app/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      });
      let response = await data.json();
      console.log(response);
      if (!chats.find((c) => c._id === response._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(response);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setLoadingChat(false);
    }
  };
  return (
    <>
      <Box className="dashboard">
        <Tooltip label="SearchContacts" hasArrow placement="bottom-end">
          <Button variant="ghost" margin={2} onClick={() => onOpen()}>
            <i className="fas fa-search"></i>
            <Text
              className="searchBarText"
              display={{ base: "none", md: "block" }}
            >
              Search Contacts
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans" paddingTop="1%">
          VOLUBLE
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <ChatIcon m={1} fontSize="2xl" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Notifications!"}
              {notification.map((notify, idx) => {
                return (
                  <MenuItem
                    key={idx}
                    onClick={() => {
                      setSelectedChat(notify.chat);
                      setNotification(
                        notification.filter((nots) => nots !== notify)
                      );
                    }}
                  >
                    {notify.chat.isGroupChat
                      ? `Someone messaged in ${notify.chat.chatName}`
                      : `${getSender2(user, notify.chat.users)} messaged you `}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              type="button"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileView user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileView>
              <hr />
              <MenuItem
                onClick={() => {
                  logOutMethod();
                }}
              >
                LogOut
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Contacts</DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => handleSearch()}>
                <i className="fas fa-search"></i>
              </Button>
            </Box>
            {loading ? (
              <iframe src="https://embed.lottiefiles.com/animation/97930"></iframe>
            ) : (
              searchResult?.map((user, idx) => (
                //<h1>{user.name}</h1>
                <Box
                  key={idx}
                  onClick={() => accessChat(user._id)}
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
            {loadingChat && (
              <iframe src="https://embed.lottiefiles.com/animation/99833"></iframe>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
