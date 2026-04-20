import { useEffect, useState } from "react";
import Input from "../input";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversations,
  profiles,
  searchUsers,
  us,
} from "../../store/atoms/atom";
import { useFetchMessage } from "../../utils/fetchMessage";
import { MdOutlineMessage } from "react-icons/md";
import goku from "../../assets/goku.jpg";
import { UserIcon } from "@heroicons/react/outline";
import Profile
 from "../input/Profile";


export default function SearchUser(){
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();
  const [conversation, setConversation] = useRecoilState(conversations);
  const [users, setUsers] = useState([]);
  const [interest, setInterest] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const fetchMessage = useFetchMessage();
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [ViewingOwnProfile, setViewingOwnProfile] = useState(false);
  const [profile, setProfile] = useRecoilState(profiles);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:8000/api/users");
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = interest.trim().toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.user.interest?.toLowerCase().includes(term) &&
          u.user.email !== user.email,
      ),
    );
  }, [interest, users]);

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
    fetchMessage(conversationId, receiver, openProfile);
  };


 return( <div>
           <div className="pl-5">
            <Input
              placeholder="Search users by interest..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full mb-4 p-2 ml-5 mt-7 text-lg bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder-slate-400 text-slate-700 font-semibold"
            />
          </div>
           {profile && (
                      <div>
                        <Profile
                          setProfile={setProfile}
                          profile={profile}
                          ViewingOwnProfile={ViewingOwnProfile}
                          setViewingOwnProfile={setViewingOwnProfile}
                        />
                      </div>
              )}

          {/* ── User cards */}
          {filteredUsers.map(({ user: u }) => (
            <div
              key={u._id}
              className="w-[95%] bg-white p-4 mb-3 ml-10 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 cursor-pointer transition-all group m-2"
              onClick={() => FetchMessages("new", u, true)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={u?.profilePic ? `${u.profilePic}` : goku}
                  className="w-12 h-12 border border-slate-200 bg-slate-100 rounded-xl object-cover flex-shrink-0"
                  alt="avatar"
                />
                <div className="flex-1 flex items-center gap-7">
                  <div className="font-semibold text-sm text-slate-800 w-44">
                    {u.fullName}
                  </div>
                  <div className="text-sm text-violet-500 relative max-w-56 w-fit">
                    {u.interest}
                  </div>
                  <div className="text-xs text-slate-400 relative left-44 max-w-56 w-fit flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${u.isOnline ? "bg-emerald-400" : "bg-slate-300"}`} />
                    {u.isOnline ? "online" : "offline"}
                  </div>
                  <div className="relative h-5 w-5">
                    <MdOutlineMessage
                      color="#7C3AED"
                      className="hover:bg-violet-100 rounded"
                      onClick={() => {
                        navigate("/Messages");
                      }}
                    />
                  </div>
                  <div>
                    <UserIcon
                      className="w-5 h-5 relative -top-1 text-slate-400 hover:text-violet-600 transition-colors"
                      onClick={(e) => {
                        console.log(u);
                        navigate(`/Profile/${u.receiverId}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
 )
} 