import React, { useEffect } from "react";
import { useFetchMessage } from "../../utils/fetchMessage";
import { useRecoilState } from "recoil";
import {
  conversations,
  profiles,
  searchUsers,
  us,
} from "../../store/atoms/atom";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/outline";
import SearchIcon from "../input/SearchIcon.js";
import goku from "../../assets/goku.jpg";

function Connection({ className }) {
  const [user, setUser] = useRecoilState(us);
  const fetchMessage = useFetchMessage();
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [conversation, setConversation] = useRecoilState(conversations);
  const [profile, setProfile] = useRecoilState(profiles);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversation/${user._id}`,
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
  }, [user, searchUser]);

  const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
  };

  return (
    <div
      className={`w-[28%] w-max-[28%] h-full p-4 overflow-y-auto bg-white border-r border-slate-200 mt-2 ${className} pt-14`}
    >
      <div className="flex flex-col gap-2">
        <SearchIcon
          className="mb-4"
          onChange={(e) => setSearchUsers(e.target.value)}
        />
        <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase ml-7 mb-7">
          CONNECTION
        </div>
        { conversation.map(({ conversationId, user: otherUser }) => (
          <div
            key={conversationId}
            className="w-full p-4 rounded-xl hover:bg-violet-50 hover:border-violet-100 border border-transparent cursor-pointer transition-all group"
            onClick={() => FetchMessages(conversationId, otherUser, true)}
          >
            <div className="flex items-center gap-6">
              <img
                src={otherUser?.profilePic ? `${otherUser.profilePic}` : goku}
                className="w-12 h-12 border border-slate-200 bg-slate-100 rounded-xl object-cover flex-shrink-0"
                alt="avatar"
              />
              <div className="">
                <div className="font-semibold text-sm text-slate-800 w-44">
                  {otherUser.fullName}
                </div>
                <div className="text-xs text-violet-400 max-w-28 w-fit h-max-4 h-fit mt-0.5">
                  {otherUser.interest}
                </div>
              </div>
              <span className="relative right-14">
                {otherUser.isOnline ? (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                )}
              </span>
              <div className="relative -left-16 opacity-0 group-hover:opacity-100 transition-opacity">
                <MdOutlineMessage
                  color="#7C3AED"
                  className="hover:bg-violet-100 rounded p-0.5"
                  onClick={() => {
                    navigate("/Messages");
                  }}
                />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <UserIcon
                  className="w-5 h-5 relative -left-20 text-slate-400 hover:text-violet-600"
                  onClick={() => {
                    setProfile(!profile);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connection;
