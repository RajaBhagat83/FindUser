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
  const [postUser,setPostuser] = useRecoilState(userpost);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() =>{
   const user = localStorage.getItem("user:details"); 
    if(user)setUser(JSON.parse(user));
  },[])

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
    <div className="w-screen h-screen flex flex-col bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 font-sans selection:bg-violet-500/30 transition-colors duration-300">
      <div className="flex flex-grow overflow-hidden relative">
        
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
        <div className="flex-1 h-full relative overflow-y-auto bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">

          {/* ── Header */}
          <Header 
            handleLogout={handleLogout} 
            setProfile={setProfile} 
            profile={profile} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className="pt-24 px-8 pb-12 max-w-3xl mx-auto"> 
            {profile && (
              <div className="mb-8 transition-all duration-500 ease-out">
                <Profile
                  setProfile={setProfile}
                  profile={profile}
                  ViewingOwnProfile={ViewingOwnProfile}
                  setViewingOwnProfile={setViewingOwnProfile}
                />
              </div>
            )}
            
            <div className="transition-all duration-700 ease-out">
              <PostPage />
            </div>
            {userpost !="" && 
               <div className="mt-8 text-center text-slate-500">{userpost[0]}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;