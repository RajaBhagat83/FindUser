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
import { MdOutlineMessage } from "react-icons/md";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="w-screen h-screen flex flex-col bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 font-sans selection:bg-violet-500/30 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      
      <div className="flex flex-grow overflow-hidden relative z-10">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Connection 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(false)} 
        />
        
        <div className="flex-1 h-full flex flex-col relative z-10 bg-slate-50/50 dark:bg-[#0b1120]/50 backdrop-blur-sm transition-colors duration-300 w-full overflow-hidden">
          {messages.receiver ? (
            <>
              {/* ── Receiver header bar */}
              <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex-shrink-0 shadow-sm dark:shadow-sm dark:shadow-black/20 z-30 transition-colors duration-300">
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="relative">
                    <img
                      src={selectedUser?.profilePic ? `${selectedUser.profilePic}` : Avatar }
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-500/30 shadow-sm dark:shadow-md"
                      alt="avatar"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0f172a] ${online === true ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-slate-300 dark:bg-slate-600"}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 transition-colors duration-300">
                      {messages.receiver.fullName}
                    </div>
                    <div className="text-xs text-violet-500 dark:text-violet-400/80 font-medium transition-colors duration-300">{online ? "Online now" : messages.receiver.email}</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer border border-transparent dark:border-white/5">
                  <img src={Phone} className="w-5 h-5 opacity-50 dark:opacity-70 dark:filter dark:invert" alt="phone" />
                </div>
              </div>

              {/* ── Messages area */}
              <div className="flex-1 w-full overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-2 custom-scrollbar">
                {messages.messages.map((msg, idx) => {
                  const isMe = msg.user._id === user._id;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] md:max-w-[65%] w-fit mb-2 ${
                        isMe ? "ml-auto items-end" : "items-start"
                      } animate-in slide-in-from-bottom-2 fade-in duration-300`}
                    >
                      <div
                        className={`py-2.5 px-5 text-sm leading-relaxed break-words shadow-sm ${
                          isMe
                            ? "bg-gradient-to-br from-violet-600 to-violet-500 text-white rounded-2xl rounded-br-sm shadow-violet-500/20"
                            : "bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-sm transition-colors duration-300"
                        }`}
                      >
                        {msg.message}
                      </div>
                      {msg.createdAt && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1.5 font-medium transition-colors duration-300">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messageRef} />
              </div>

              {/* ── Input row */}
              <div className="w-full px-4 md:px-6 py-4 md:py-5 bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 flex-shrink-0 z-30 transition-colors duration-300 pb-safe">
                <div className="flex items-center gap-2 md:gap-3 bg-slate-50 dark:bg-[#1e293b]/80 border border-slate-200 dark:border-white/10 rounded-2xl px-2 py-2 shadow-inner focus-within:border-violet-300 dark:focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-300 dark:focus-within:ring-violet-500/50 transition-all">
                  <div 
                    className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer transition-colors"
                    onClick={() =>
                      window.open(
                        "https://www.hdfcbank.com/personal/pay/money-transfer",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src={Payment}
                      className="w-5 h-5 opacity-40 hover:opacity-80 dark:opacity-60 dark:hover:opacity-100 transition-opacity dark:filter dark:invert"
                      alt="payment"
                    />
                  </div>
                  
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && message.trim()) handleMessage();
                    }}
                    className="flex-grow bg-transparent border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 text-sm py-2 px-1"
                  />
                  
                  <button
                    onClick={handleMessage}
                    disabled={!message.trim()}
                    className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-violet-500/20 group flex-shrink-0"
                  >
                    <img src={messageIcon} className="w-4 h-4 filter invert group-hover:scale-110 transition-transform" alt="send" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 px-4">
              <div className="relative">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden absolute -top-16 left-0 p-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="absolute inset-0 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-20 h-20 rounded-full bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-white/5 flex items-center justify-center relative z-10 shadow-lg dark:shadow-xl transition-colors duration-300">
                  <MdOutlineMessage size={32} className="text-violet-400 opacity-80 dark:opacity-50" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1 transition-colors duration-300">Your Messages</h3>
                <p className="text-sm text-slate-500 max-w-xs transition-colors duration-300">Select a conversation from the sidebar or start a new one to begin chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messanging;