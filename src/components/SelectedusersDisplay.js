import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import React from "react";

const SelectedusersDisplay = ({ user, handleFunction }) => {
  return (
    <span
      onClick={() => handleFunction()}
      style={{
        border: "1px solid green",
        borderRadius: "10px",
        margin: "3px",
        width: "45%",
      }}
    >
      <Avatar src={user.pic} size="lg" />
      <Box ml="3">
        <Text fontWeight="bold">
          {user.name}
          <Badge ml="1" colorScheme="green">
            X
          </Badge>
        </Text>
      </Box>
    </span>
  );
};

export default SelectedusersDisplay;
