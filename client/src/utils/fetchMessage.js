import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {  messaging, selectedUsers, us } from "../store/atoms/atom";
import React from "react";
import { BACKEND_URL } from "../Components/config";

export const useFetchMessage = () => {
  const user = useRecoilValue(us);
  const setMessages = useSetRecoilState(messaging);
  const setSelectedUser = useSetRecoilState(selectedUsers);


  const fetchMessage = React.useCallback(async (conversationId, receiver, openProfile = true ) => {
    if (!conversationId || !receiver || !user?._id) return;

    try {
      const url =
        conversationId === "new"
          ? `${BACKEND_URL}/api/messages/new?senderId=${user._id}&receiverId=${receiver.receiverId}`
          : `${BACKEND_URL}/api/messages/${conversationId}`;

      const res = await fetch(url);
      const data = await res.json();

      setMessages({
        messages: data,
        receiver,
        conversationId,
      });
      if (openProfile) {
        setSelectedUser({...receiver,conversationId});
      }
    } catch (error) {
      console.error(error);
    }
  },[user, setMessages, setSelectedUser]);

  return fetchMessage;
};
