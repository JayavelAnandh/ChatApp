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
  Image,
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
import ProfileView from "./ProfileView";
import "./sidebar.css";
const Sidebar = () => {
  let navigate = useNavigate();
  let toast = useToast();
  let [search, setSearch] = useState("");
  let [searchResult, setSearchResult] = useState();
  let [loading, setLoading] = useState(false);
  let [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let user = ChatStates().userDetails;

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

      let res = await fetch(`http://localhost:5000/user/all?search=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

        <Text fontSize="2xl" fontFamily="Work sans">
          VOLUBLE
        </Text>

        <Menu>
          <MenuButton>
            <ChatIcon />
          </MenuButton>
        </Menu>
        <Menu>
          <MenuButton type="button" as={Button} rightIcon={<ChevronDownIcon />}>
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
                <h1>{user.name}</h1>
                // <UserListItem
                //   key={idx}
                //   user={user}
                //   handleFunction={() => accessChat(user._id)}
                // />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
