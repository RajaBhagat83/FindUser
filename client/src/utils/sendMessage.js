export const sendMessage = async ({
  socket,
  userId,
  message,
  receiver,
  conversationId,
  fetchMessage,
}) => {
  if (!receiver || !message.trim()) return;

  // Send via socket
  socket?.emit("sendMessage", {
    ConversationId: conversationId,
    senderId: userId,
    message,
    receiverId: receiver.receiverId,
  });

  // Send to backend
  const res =await fetch("http://localhost:8000/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ConversationId: conversationId || "new",
      senderId: userId,
      message,
      receiverId: receiver.receiverId,
    }),
  });
  const data =await res.json();
  const neewConversationId = data.ConversationId || conversationId;

  // Optionally refresh messages
     if (fetchMessage) {
    await fetchMessage(neewConversationId, receiver, false);
  }
};
