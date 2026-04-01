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
        `http://localhost:8000/api/conversation/${user._id}`
      );
      const data = await res.json();
      const search = searchUser.trim().toLowerCase();
      if (!search) return setConversation(data);
      setConversation(
        data.filter((item) =>
          item.user?.fullName?.toLowerCase().includes(search)
        )
      );
    })();
  }, [user, searchUser]);

  const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
  };

  return (
    <div
      className={`w-max-[28%] w-fit h-full p-4 overflow-y-auto bg-gray-50 border-r-1 mt-2 ${className} `}
    >
      <div className="flex flex-col gap-2">
        <SearchIcon
          className="mb-4"
          onChange={(e) => setSearchUsers(e.target.value)}
        />
        <div className="text-xl font-bold text-gray-400 ml-7 mb-7">
          CONNECTION
        </div>
        {conversation.map(({ conversationId, user: otherUser }) => (
          <div
            key={conversationId}
            className="w-full p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => FetchMessages(conversationId, otherUser, true)}
          >
            <div className="flex items-center gap-6">
              <img src={otherUser?.profilePic ?`http://localhost:8000${otherUser.profilePic}?t=${Date.now()}` : goku} className="w-15 h-16 rounded-full" alt="avatar" />
              <div className="">
                <div className="font-semibold w-44">{otherUser.fullName}</div>
                <div className="text-sm max-w-28 w-fit h-max-4 h-fit">{otherUser.interest}</div>
              </div>
              <div className="relative -left-14 ">
                <MdOutlineMessage
                  color="black"
                  className="hover:bg-blue-400"
                  onClick={() => {
                    navigate("/Messages");
                  }}
                />
              </div>
              <div>
                <UserIcon
                  className="w-5 h-5  relative -left-16"
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
