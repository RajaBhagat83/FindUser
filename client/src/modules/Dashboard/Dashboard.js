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
  userpost,
  ViewingOwnProfiles,
} from "../../store/atoms/atom";
import { RiMegaphoneLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineMessage } from "react-icons/md";
import goku from "../../assets/goku.jpg";
import Profile from "../input/Profile.js";
import Connection from "../Elements/Connection.js";
import Searching from "../Elements/Searching.js"
import PostPage from "../Elements/Post.js";
import Header from "../Elements/Header.js";

function Dashboard({ handleLogout }) {
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();
  const [conversation, setConversation] = useRecoilState(conversations);
  const [users, setUsers] = useState([]);
  const [interest, setInterest] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profile, setProfile] = useRecoilState(profiles);
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [ViewingOwnProfile, setViewingOwnProfile] = useRecoilState(ViewingOwnProfiles);
  const [postUser,setPostuser] = useRecoilState(userpost)

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
    <div className="w-screen h-screen flex flex-col px-12 bg-slate-100">
      <div className="flex flex-grow overflow-hidden rounded-xl">
        <Connection />
        <div className="w-max-[55%] w-[55%] h-full border-l border-slate-200 p-4 overflow-y-auto z-20">

          {/* ── Header */}
          <Header  handleLogout={handleLogout} setProfile={setProfile} profile={profile}  />
          <div className="pt-14"> {/* matches h-14 */}
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
          {/* {Post page} */}
          <PostPage />
          {userpost !="" && 
             <div>{userpost[0]}</div>
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;