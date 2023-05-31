import { Avatar, Text } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatStates } from "../chatContext";
import { isLastMessage, isSameSender } from "./commonFunctions";

const ScrollableChats = ({ messages }) => {
  const user = ChatStates().userDetails;

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: `${
                  message.sender._id === user._id ? "flex-end" : "flex-start"
                }`,
              }}
            >
              {(isSameSender(messages, message, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Avatar
                  style={{ marginRight: "10px", marginTop: "0px" }}
                  size="md"
                  cursor="pointer"
                  src={message.sender.pic}
                  title={message.sender.name}
                ></Avatar>
              )}
              <Text
                style={{
                  display: "flex",
                  backgroundColor: `${
                    message.sender._id === user._id ? "gainsboro" : "green"
                  }`,
                  borderRadius: "10px",
                  padding: "3px 12px",
                  maxWidth: "75%",
                }}
              >
                {message.content}
              </Text>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
