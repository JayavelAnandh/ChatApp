import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatStates } from "../chatContext";
import ProfileView from "./ProfileView";
import "./sidebar.css";
const Sidebar = () => {
  let navigate = useNavigate();
  let [search, setSearch] = useState("");
  let [searchResult, setSearchResult] = useState();
  let [loading, setLoading] = useState(false);
  let [loadingChat, setLoadingChat] = useState();

  let user = ChatStates().userDetails;

  const logOutMethod = () => {
    localStorage.removeItem("user-details");
    localStorage.removeItem("x-auth-token");
    navigate("/");
  };
  return (
    <>
      <Box className="dashboard">
        <Tooltip label="SearchContacts" hasArrow placement="bottom-end">
          <Button variant="ghost" margin={2}>
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
    </>
  );
};

export default Sidebar;
