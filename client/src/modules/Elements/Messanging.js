import React, { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.svg";
import Phone from "../../assets/phone.svg";
import messageIcon from "../../assets/message.svg";
import Input from "../input";
import Payment from "../../assets/payment.svg";
import { useRecoilState } from "recoil";
import {
  messag,
  messaging,
  selectedUsers,
  us,
  refreshConnectionsAtom
} from "../../store/atoms/atom";
import { sendMessage } from "../../utils/sendMessage";
import { useFetchMessage } from "../../utils/fetchMessage";
import { useNavigate, useParams } from "react-router-dom";
import Connection from "./Connection";
import { useRef } from "react";

function Messanging({ socket }) {
  const [messages, setMessages] = useRecoilState(messaging);
  const [message, setMessage] = useRecoilState(messag);
  const [user, setUser] = useRecoilState(us);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUsers);
  const [, setRefresh] = useRecoilState(refreshConnectionsAtom);
  const fetchMessage = useFetchMessage();
  const [online, setOnline] = useState("");
  const messageRef = useRef();
  const { userId }= useParams();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.messages]);

  useEffect(() => {
    setOnline(messages.receiver?.isOnline);
  }, [messages]);


  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addUser", user._id);
    const handleGetMessage = (data) => {
      setRefresh(r => r + 1);
      setMessages((prev) => {
        if (prev.conversationId === data.conversationId || prev.receiver?.receiverId === data.senderId) {
          return {
            ...prev,
            conversationId: data.conversationId,
            receiverId: data.receiverId,
            messages: [
              ...prev.messages,
              {
                user: data.user,
                message: data.message,
                createdAt: data.createdAt,
              },
            ],
          };
        }
        return prev;
      });
    };
    socket.on("getMessage", handleGetMessage);

    return () => {
      socket.off("getMessage", handleGetMessage);
    };
  }, [socket, user]);

  const handleMessage = () => {
    sendMessage({
      socket,
      userId: user._id,
      message,
      receiver: messages.receiver,
      conversationId: messages.conversationId,
      fetchMessage: fetchMessage,
    });
    setMessage("");
  };

  useEffect(() => {
    if (selectedUser) return;
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      const obj = JSON.parse(savedUser);
      console.log("selectedUser : ",obj);
      setSelectedUser(obj);
      fetchMessage(obj.conversationId || "new", obj, false);
    }
  }, [fetchMessage, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser,user]);

  return (
    <div className="w-[70%] h-screen flex flex-col border-x border-slate-200 bg-slate-50">
      {messages.receiver ? (
        <>
          {/* ── Receiver header bar */}
          <div className="flex justify-between items-center w-full px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedUser?.profilePic ? `${selectedUser.profilePic}` : Avatar }
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-100"
                  alt="avatar"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${online === true ? "bg-emerald-400" : "bg-slate-300"}`} />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-800">
                  {messages.receiver.fullName}
                </div>
                <div className="text-xs text-slate-400">{messages.receiver.email}</div>
              </div>
            </div>
            <img src={Phone} className="w-4 h-4 opacity-40 hover:opacity-80 transition-opacity cursor-pointer" alt="phone" />
          </div>

          {/* ── Messages area */}
          <div className="flex-1 w-full overflow-y-auto px-6 py-5 flex flex-col gap-1">
            {messages.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[55%] w-fit mb-1 ${
                  msg.user._id === user._id ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div
                  className={`py-2.5 px-4 text-sm leading-relaxed break-words ${
                    msg.user._id === user._id
                      ? "bg-violet-500 text-white rounded-2xl rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-md"
                  }`}
                >
                  {msg.message}
                </div>
                {msg.createdAt && (
                  <div className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            ))}
            <div ref={messageRef} />
          </div>

          {/* ── Input row */}
          <div className="w-full flex items-center gap-3 px-5 py-4 bg-white border-t border-slate-200 flex-shrink-0">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow border border-slate-200 rounded-xl bg-slate-50 focus:ring-violet-300"
            />
            <img
              src={Payment}
              className="w-5 h-5 cursor-pointer opacity-40 hover:opacity-80 transition-opacity flex-shrink-0"
              alt="payment"
              onClick={() =>
                window.open(
                  "https://www.hdfcbank.com/personal/pay/money-transfer",
                  "_blank"
                )
              }
            />
            <button
              onClick={handleMessage}
              disabled={!message.trim()}
              className="p-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <img src={messageIcon} className="w-4 h-4" alt="send" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-300" />
          </div>
          <p className="text-sm text-slate-400">No conversation selected</p>
          <p className="text-xs text-slate-300">Pick someone from your connections to start chatting</p>
        </div>
      )}

      <Connection className="absolute top-0 right-[20px] py-7" />
    </div>
  );
}

export default Messanging;