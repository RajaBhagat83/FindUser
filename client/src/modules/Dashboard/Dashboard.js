import { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.svg";
import Input from "../input";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { conversations, messag, messaging, profiles, searchUsers, us } from "../../store/atoms/atom";
import { useFetchMessage } from "../../utils/fetchMessage";
import SearchIcon from "../input/SearchIcon.js";
import { RiMegaphoneLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineMessage } from "react-icons/md";
import goku from "../../assets/goku.jpg";
import Profile from "../input/Profile.js";
import { UserIcon } from "@heroicons/react/outline";
import Connection from "../Elements/Connection.js";

function Dashboard({ handleLogout }) {
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();
  const [conversation, setConversation] = useRecoilState(conversations);
  const [messages, setMessages] = useRecoilState(messaging);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [interest, setInterest] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const fetchMessage = useFetchMessage();
  const [profile, setProfile] = useRecoilState(profiles);
  const [searchUser, setSearchUsers] = useRecoilState(searchUsers);
  const [ViewingOwnProfile,setViewingOwnProfile] =useState(false);

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
    if (!term) return setFilteredUsers(users.filter((u) => u._id !== user._id));
    setFilteredUsers(
      users.filter(({ user }) => user.interest?.toLowerCase().includes(term))
    );
  }, [interest, users]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("addUser", user._id);
    const handleGetMessage = (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message, createdAt: data.createdAt },
        ],
      }));
    };

    socket.on("getMessage", handleGetMessage);

    return () => {
      socket.off("getMessage", handleGetMessage);
    };
  }, [socket, user]);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversation/${user._id}`
      );
      const data = await res.json();
      console.log(data);
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
    <div className="w-screen h-screen flex flex-col px-12 bg-whit ">
      <div className="flex flex-grow overflow-hidden rounded-xl ">
        <Connection  />       
        <div className="w-[55%] h-full border-l-4 p-4 overflow-y-auto  z-20 ">
          <header className="w-[70%] relative -right-24 h-20 rounded-3xl bg-gradient-to-r bg-gray-100 shadow-md flex px-6 text-white font-semibold text-xl items-center justify-center top-0">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePic ?`http://localhost:8000${user.profilePic}?t=${Date.now()}` : "/default-avatar.png"}
                height="50"
                width="50"
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <span
                className="text-black hover:bg-blue-400 cursor-pointer"
                onClick={() => {
                  setProfile(!profile);
                  setViewingOwnProfile(!ViewingOwnProfile);
                }}
              >
                {user.fullName || "User"}
              </span>
            </div>
            <nav className="ml-auto flex items-center space-x-8">
              <button onClick={() => navigate("/Messages")}>
                <MdOutlineMessage color="black" className="hover:bg-blue-400" />
              </button>
              <button onClick={() => navigate("/Whatnew")}>
                <RiMegaphoneLine color="black" className="hover:bg-blue-400" />
              </button>
              <button onClick={handleLogout}>
                <FiLogOut
                  color="black"
                  className=" w-12 hover:bg-blue-400"
                  size={20}
                />
              </button>
            </nav>
          </header>
          {profile && (
            <div>
              <Profile setProfile={setProfile} profile={profile} ViewingOwnProfile={ViewingOwnProfile} setViewingOwnProfile={setViewingOwnProfile} />
            </div>
          )}
          <Input
            placeholder="Search users by interest..."
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-[50%] mb-4 p-2 ml-5 mt-7"
          />
          {filteredUsers.map(({ user: u }) => (
            <div
              key={u._id}
              className="w-[90%] bg-white p-4 mb-3 ml-10 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => FetchMessages("new", u, true)}
            >
              <div className="flex items-center gap-12">
                <img
                  src={u?.profilePic ?`http://localhost:8000${u.profilePic}?t=${Date.now()}` : goku}
                  className="w-44 h-44 border-4 border-gray-400 bg-gray-400 rounded-xl "
                  alt="avatar"
                
                />
                <div className="w-72 mb-32 flex gap-4">
                  <div className="font-semibold text-xl w-72">{u.fullName}</div>
                  <div className="text-sm relative left-44 max-w-44 w-fit">{u.interest}</div>
                  <div className="relative  left-52 h-5 w-5">
                    <MdOutlineMessage
                      color="black"
                      className="hover:bg-blue-400"
                      onClick={() => {
                        navigate("/Messages")
                      }}
                    />
                  </div>
                  <div>
                     <UserIcon className="w-5 h-5 left-52  relative -top-1"   onClick={() => {
                    setProfile(!profile)
                  }} />
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

export default Dashboard;
