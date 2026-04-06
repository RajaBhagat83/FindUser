import { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.svg";
import Input from "../input";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversations,
  messag,
  messaging,
  profiles,
  searchUsers,
  us,
} from "../../store/atoms/atom";
import { RiMegaphoneLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineMessage } from "react-icons/md";
import goku from "../../assets/goku.jpg";
import Profile from "../input/Profile.js";
import Connection from "../Elements/Connection.js";
import Searching from "../Elements/Searching.js"

function Dashboard({ handleLogout }) {
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();
  const [conversation, setConversation] = useRecoilState(conversations);
  const [users, setUsers] = useState([]);
  const [interest, setInterest] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profile, setProfile] = useRecoilState(profiles);
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [ViewingOwnProfile, setViewingOwnProfile] = useState(false);

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

  return (
    <div className="w-screen h-screen flex flex-col px-12 bg-slate-50">
      <div className="flex flex-grow overflow-hidden rounded-xl">
        <Connection />
        <div className="w-max-[55%] w-[55%] h-full border-l border-slate-200 p-4 overflow-y-auto z-20">

          {/* ── Header */}
          <header className="w-full h-14 rounded-xl bg-white border border-slate-200 flex px-6 font-semibold items-center justify-between top-0">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePic ? `${user.profilePic}` : goku}
                height="50"
                width="50"
                alt="avatar"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-100"
              />
              <span
                className="text-sm font-semibold text-slate-700 hover:text-violet-600 cursor-pointer transition-colors"
                onClick={() => {
                  setProfile(!profile);
                  setViewingOwnProfile(!ViewingOwnProfile);
                }}
              >
                {user.fullName || "User"}
              </span>
            </div>
            <nav className="ml-auto flex items-center space-x-1">
              <button
                onClick={() => navigate("/Messages")}
                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                <MdOutlineMessage size={18} />
              </button>
              <button
                onClick={() => navigate("/Whatnew")}
                className="p-2 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                <RiMegaphoneLine size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
              >
                <FiLogOut size={18} />
              </button>
            </nav>
          </header>

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

          {/* ── Search */}
         <Searching />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;