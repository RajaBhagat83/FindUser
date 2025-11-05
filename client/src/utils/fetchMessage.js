import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { addpages, messaging, selectedUsers, us } from "../store/atoms/atom";
import React from "react";

export const useFetchMessage = () => {
  const user = useRecoilValue(us);
  const setMessages = useSetRecoilState(messaging);
  const setSelectedUser = useSetRecoilState(selectedUsers);
  const setAddpage = useSetRecoilState(addpages);


  const fetchMessage = React.useCallback(async (conversationId, receiver, openProfile = true ) => {
    if (!conversationId || !receiver || !user?._id) return;

    try {
      const url =
        conversationId === "new"
          ? `http://localhost:8000/api/messages/new?senderId=${user._id}&receiverId=${receiver.receiverId}`
          : `http://localhost:8000/api/messages/${conversationId}`;

      const res = await fetch(url);
      const data = await res.json();

      setMessages({
        messages: data,
        receiver,
        conversationId,
      });
      if (openProfile) {
        setSelectedUser({...receiver,conversationId});
        setAddpage(false);
      }
    } catch (error) {
      console.error(error);
    }
  },[user, setMessages, setSelectedUser, setAddpage]);

  return fetchMessage;
};
