import React, { useEffect } from "react";
import Avatar from "../../assets/avatar.svg";
import Phone from "../../assets/phone.svg";
import messageIcon from "../../assets/message.svg";
import Input from "../input";
import Payment from "../../assets/payment.svg";
import { useRecoilState } from "recoil";
import {
  addpages,
  messag,
  messaging,
  selectedUsers,
  sockets,
  us,
} from "../../store/atoms/atom";
import { sendMessage } from "../../utils/sendMessage";
import { useFetchMessage } from "../../utils/fetchMessage";
import { useNavigate } from "react-router-dom";
import Connection from "./Connection";

function Messanging() {
  const [addpage, setAddpage] = useRecoilState(addpages);
  const [messages, setMessages] = useRecoilState(messaging);
  const [message, setMessage] = useRecoilState(messag);
  const [user, setUser] = useRecoilState(us);
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUsers);
  const [socket, setSocket] = useRecoilState(sockets);
  const fetchMessage = useFetchMessage();
  const navigate = useNavigate();

  const handleMessage = () => {
    sendMessage({
      socket,
      userId: user._id,
      message,
      receiver: messages.receiver,
      conversationId: messages.conversationId,
    });
    setTimeout(() => {
      fetchMessage(messages.conversationId, messages.receiver, false);
    }, 100);

    setMessage("");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      const obj = JSON.parse(savedUser);
      setSelectedUser(obj);
      setAddpage(false);
      fetchMessage(obj.conversationId || "new", obj, false);
    }
  }, [fetchMessage, setSelectedUser, setAddpage]);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

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
      {addpage && selectedUser ? (
        <div className="w-full  from-blue-50 to-blue-100rounded-xl p-6 shadow-lg border-2 border-black ">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <img
                src={Avatar}
                className="w-12 h-12 rounded-full"
                alt="avatar"
              />
              <div>
                <div className="text-xl font-bold">{selectedUser.fullName}</div>
                <div className="text-sm">{selectedUser.email}</div>
                <div className="text-sm">{selectedUser.interest}</div>
              </div>
            </div>
            <button
              onClick={() => setAddpage(false)}
              className="text-red-500 font-bold text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      ) : messages.receiver ? (
        <>
          <div className="flex justify-between w-full p-4 bg-blue-100 rounded-lg overscroll-contain...">
            <div className="flex items-center gap-4">
              <img
                src={Avatar}
                className="w-10 h-10 rounded-full"
                alt="avatar"
              />
              <div>
                <div className="font-semibold">
                  {messages.receiver.fullName}
                </div>
                <div className="text-sm">{messages.receiver.email}</div>
              </div>
            </div>
            <img src={Phone} className="w-6 h-6" alt="phone" />
          </div>
          <div className="flex-1 w-full overflow-y-auto my-4 p-4 bg-gray-50 rounded-lg ">
            {messages.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[60%] p-3 mb-2 rounded-lg ${
                  msg.user._id === user._id
                    ? "bg-blue-200 ml-auto"
                    : "bg-yellow-100"
                }`}
              >
                <div>{msg.message}</div>
                {msg.createdAt && (
                  <div className="text-xs text-black font-semibold text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full flex items-center gap-4">
            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded"
            />
            <img
              src={Payment}
              className="w-8 h-8 cursor-pointer"
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
