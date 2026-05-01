import { BACKEND_URL } from "../Components/config";

export const sendMessage = async ({
  socket,
  userId,
  message,
  receiver,
  conversationId,
  fetchMessage,
}) => {
  if (!receiver || !message.trim()) return;

  // 1. Send to backend FIRST to generate/resolve conversation ID
  const res = await fetch(`${BACKEND_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ConversationId: conversationId || "new",
      senderId: userId,
      message,
      receiverId: receiver.receiverId,
    }),
  });
  const data = await res.json();
  const newConversationId = data.ConversationId || conversationId;

  // 2. NOW emit the socket with the CORRECT lowercase conversationId
  socket.emit("sendMessage", {
    senderId: userId,
    receiverId: receiver.receiverId,
    conversationId: newConversationId,
    message
  });

  // Optionally refresh messages
  if (fetchMessage) {
    await fetchMessage(newConversationId, receiver, false);
  }
};
