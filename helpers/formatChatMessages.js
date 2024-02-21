module.exports.formatChatMessageTime = function (chat) {
  chat.messages = chat.messages.map((message) => {
    message.createdAt = new Date(message.createdAt).getTime();
    return message;
  });
  return chat;
};
