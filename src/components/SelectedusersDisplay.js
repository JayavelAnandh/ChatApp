import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import React from "react";

const SelectedusersDisplay = ({ user, handleFunction }) => {
  return (
    <span onClick={() => handleFunction()}>
      <Avatar src={user.pic} />
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
