import React, { useEffect, useState } from "react";
import { useFetchMessage } from "../../utils/fetchMessage";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversations,
  profiles,
  searchUsers,
  us,
  refreshConnectionsAtom
} from "../../store/atoms/atom";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/outline";
import SearchIcon from "../input/SearchIcon.js";
import goku from "../../assets/goku.jpg";
import { BACKEND_URL } from "../../Components/config.js";

function Connection({ className, isSidebarOpen, toggleSidebar }) {
  const [user, setUser] = useRecoilState(us);
  const fetchMessage = useFetchMessage();
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [conversation, setConversation] = useRecoilState(conversations);
  const [profile, setProfile] = useRecoilState(profiles);
  const [refresh,setRefresh] = useRecoilState(refreshConnectionsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/conversation/${user._id}`,
      );
      const data = await res.json();
      const search = searchUser.trim().toLowerCase();
      if (!search) return setConversation(data);
      setConversation(
        data.filter((item) =>
          item.user?.fullName?.toLowerCase().includes(search),
        ),
      );
    })();
  }, [user,searchUser]);

  const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
    if (toggleSidebar) toggleSidebar(); // Close sidebar on mobile when a chat is selected
  };
  console.log("Connection is :",conversation);

  return (
    <div
      className={`fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-80 md:w-[30%] md:min-w-[300px] h-full p-6 overflow-y-auto bg-white dark:bg-[#0b1120] md:dark:bg-transparent border-r border-slate-200 dark:border-slate-800/60 pt-24 custom-scrollbar ${className || ''}`}
    >
      <div className="flex flex-col gap-4">
        <div className="relative mb-2">
          <SearchIcon
            className="w-full bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/5 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            onChange={(e) => setSearchUsers(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
          <div className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            CONNECTIONS
          </div>
          <div className="ml-auto bg-slate-100 dark:bg-[#1e293b] text-xs px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">{conversation.length}</div>
        </div>
        
        <div className="space-y-1">
          { conversation.map(({ conversationId, user: otherUser }) => (
            <div
              key={conversationId}
              className="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 cursor-pointer transition-all duration-300 group relative overflow-hidden"
              onClick={() => FetchMessages(conversationId, otherUser, true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={otherUser?.profilePic ? `${otherUser.profilePic}` : goku}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm dark:shadow-md group-hover:shadow-violet-500/20 transition-all duration-300 border border-slate-100 dark:border-transparent"
                    alt="avatar"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0f172a] ${otherUser.isOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-slate-300 dark:bg-slate-600"}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {otherUser.fullName}
                  </div>
                  <div className="text-xs text-violet-500 dark:text-violet-400/80 truncate mt-0.5 font-medium">
                    {otherUser.interest}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <div 
                    className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-500/20 text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/Messages");
                    }}
                  >
                    <MdOutlineMessage size={18} />
                  </div>
                  <div 
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/Profile/${otherUser.receiverId}`);
                    }}
                  >
                    <UserIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Connection;
