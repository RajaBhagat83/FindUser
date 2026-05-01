import { us, ViewingOwnProfiles } from "../../store/atoms/atom";
import goku from "../../assets/goku.jpg";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { RiMegaphoneLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { FiLogOut, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Header({
  handleLogout,
  setProfile,
  profile,
  toggleSidebar,
}) {
  const [user, setUser] = useRecoilState(us);
  const navigate = useNavigate();
  const [ViewingOwnProfile, setViewingOwnProfile] = useRecoilState(ViewingOwnProfiles);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 shadow-sm dark:shadow-black/20 transition-colors duration-300">
      {/* Left — hamburger + avatar + name */}
      <div className="flex items-center gap-3 md:gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
          >
            <FiMenu size={24} />
          </button>
        )}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="avatar"
            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-500/50 hover:ring-violet-400 transition-all cursor-pointer flex-shrink-0"
            onClick={() => {
              navigate(`/Profile/${user._id}`);
              setViewingOwnProfile(true);
            }}
          />
        ) : (
          <div 
            className="h-9 w-9 md:h-10 md:w-10 rounded-full ring-2 ring-violet-200 dark:ring-violet-500/50 hover:ring-violet-400 transition-all cursor-pointer flex-shrink-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20"
            onClick={() => {
              navigate(`/Profile/${user._id}`);
              setViewingOwnProfile(true);
            }}
          >
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span
          className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-white cursor-pointer transition-colors truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
          onClick={() => {
            navigate(`/Profile/${user._id}`);
            setViewingOwnProfile(true);
          }}
        >
          {user?.fullName || "User"}
        </span>
      </div>
      
      <div
        onClick={() => navigate("/Search")}
        className="flex flex-col items-center gap-1 cursor-pointer group absolute left-1/2 -translate-x-1/2"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 group-hover:scale-105 transition-all duration-300 border border-transparent dark:border-violet-500/10">
          <svg
            className="w-5 h-5 text-violet-500 dark:text-violet-400 group-hover:text-violet-600 dark:group-hover:text-violet-300"
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
      </div>

      {/* Right — nav icons */}
      <nav className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors border border-transparent"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <button
          onClick={() =>  navigate("/Messages")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors border border-transparent dark:hover:border-violet-500/20"
        >
          <MdOutlineMessage size={20} />
        </button>
        <button
          onClick={() => navigate("/Whatnew")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors border border-transparent dark:hover:border-violet-500/20"
        >
          <RiMegaphoneLine size={20} />
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors border border-transparent dark:hover:border-rose-500/20"
        >
          <FiLogOut size={18} />
        </button>
      </nav>
    </header>
  );
}
