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
} from "../../store/atoms/atom";
import { sendMessage } from "../../utils/sendMessage";
import { useFetchMessage } from "../../utils/fetchMessage";
import { useNavigate } from "react-router-dom";
import Connection from "./Connection";
import { useRef } from "react";

function Messanging({ socket }) {
  const [messages, setMessages] = useRecoilState(messaging);
  const [message, setMessage] = useRecoilState(messag);
  const [user, setUser] = useRecoilState(us);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUsers);
  const fetchMessage = useFetchMessage();
  const navigate = useNavigate();
  const [online,setOnline] = useState("");
  const messageRef = useRef();

  useEffect(() =>{
    messageRef.current?.scrollIntoView({behavior : "smooth"});
  },[messages.messages])


  useEffect(()=>{
      setOnline(messages.receiver?.isOnline);
  },[messages])
 
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addUser", user._id);
    const handleGetMessage = (data) => {
      setMessages((prev) => {
        return {
          ...prev,
          conversationId: data.conversationId,
          receiverId : data.receiverId,
          messages: [
            ...prev.messages,
            {
              user: data.user,
              message: data.message,
              createdAt: data.createdAt,
            },
          ],
        };
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
      fetchMessage : fetchMessage
    });
    setMessage("");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      const obj = JSON.parse(savedUser);
      setSelectedUser(obj);
      fetchMessage(obj.conversationId || "new", obj, false);
    }
  }, [fetchMessage, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);
  console.log("message is online",messages.receiver?.isOnline);
  
  return (
    <div className="w-[70%] h-screen flex flex-col items-center border-x-4 mt-6 p-4 py-4 pb-12 ">
      <div className="absolute top-1 left-7 mb-12 ">
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1 me-1 mb-1 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={() => {
            setSelectedUser(null);
            localStorage.removeItem("selectedUser");
            navigate("/DashBoard");
          }}
        >
          Go Back{" "}
        </button>
      </div>
      { messages.receiver ? (
        <>
          <div className="flex justify-between w-full p-2 bg-blue-100 rounded-lg overscroll-contain... overflow-y-auto">
            <div className="flex items-center gap-6">
              <img
                src={Avatar}
                className="w-10 h-10 rounded-full"
                alt="avatar"
              />
              <div className="">
                <div className="font-semibold">
                  {messages.receiver.fullName}
                </div>
                <div className="text-sm">{messages.receiver.email}</div>
              </div>
              <div className="text-sm pt-6">{ online == true ? "online": "offline"}</div>
         
            </div>
            <img src={Phone} className="w-6 h-6" alt="phone" />
          </div>
          <div className="flex-1 w-full overflow-y-auto my-4 p-4 bg-gray-50 rounded-lg scroll-mt-6">
            {messages.messages.map((msg, idx) => (
              <div
                key={idx}
                className={` min-w-54 max-w-[60%] w-fit py-2 px-4 mb-2 rounded-lg break-words ${
                  msg.user._id === user._id
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                <div>{msg.message}</div>
                {msg.createdAt && (
                  <div className="text-[10px] text-black font-semibold text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            ))}
          <div  ref={messageRef} />
          </div>
          <div className="w-full flex items-center gap-4 h-10 pt-12">
            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded"
            />
            <img
              src={Payment}
              className="w-5 h-5 cursor-pointer"
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
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              <img src={messageIcon} className="w-6 h-6" alt="send" />
            </button>
          </div>
        </>
      ) : (
        <div className="mt-20 text-center text-xl text-gray-500">
          No conversation selected
        </div>
      )}
      <Connection className="absolute top-0 right-[20px] py-7" />
    </div>
  );
}

export default Messanging;
