import { us } from "../../store/atoms/atom";
import goku from "../../assets/goku.jpg";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { RiMegaphoneLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export default function Header({
  handleLogout,
  setViewingOwnProfile,
  setProfile,
  profile,
  ViewingOwnProfile,
}) {
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6">
      {/* Left — avatar + name */}
      <div className="flex items-center gap-3">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500 flex-shrink-0"
          />
        ) : (
          <div className="h-9 w-9 rounded-full ring-2 ring-violet-500 flex-shrink-0 bg-violet-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span
          className="text-sm font-semibold text-slate-700 hover:text-violet-600 cursor-pointer transition-colors"
          onClick={() => {
           navigate(`/Profile/${user._id}`);
            setViewingOwnProfile(!ViewingOwnProfile);
          }}
        >
          {user.fullName || "User"}
        </span>
      </div>
      <div
        onClick={() => navigate("/Search")}
        className="flex flex-col items-center gap-1 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
          <svg
            className="w-5 h-5 text-violet-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-slate-500 group-hover:text-violet-500 transition-colors">
          Search Buddy
        </span>
      </div>
      {/* Right — nav icons */}
      <nav className="flex items-center gap-1">
        <button
          onClick={() => navigate("/Messages")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
        >
          <MdOutlineMessage size={18} />
        </button>
        <button
          onClick={() => navigate("/Whatnew")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
        >
          <RiMegaphoneLine size={18} />
        </button>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
        >
          <FiLogOut size={18} />
        </button>
      </nav>
    </header>
  );
}
