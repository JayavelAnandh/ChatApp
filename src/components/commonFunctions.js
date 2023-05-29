export const getSender = (
  loggedUserId,
  user1id,
  user2id,
  user1name,
  user2name
) => {
  return user1id === loggedUserId ? user2name : user1name;
};
