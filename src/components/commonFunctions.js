export const getSender = (
  loggedUserId,
  user1id,
  user2id,
  user1name,
  user2name
) => {
  return user1id === loggedUserId ? user2name : user1name;
};
export const getSender2 = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
