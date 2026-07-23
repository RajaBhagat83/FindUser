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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-3 md:px-8 shadow-sm transition-colors duration-300">
      {/* Left — hamburger + avatar + name */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white transition-colors"
          >
            <FiMenu size={22} />
          </button>
        )}
        <div className="relative group cursor-pointer" onClick={() => {
              navigate(`/Profile/${user._id}`);
              setViewingOwnProfile(true);
            }}>
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="avatar"
              loading="lazy"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-violet-100 dark:ring-violet-500/30 group-hover:ring-violet-400 transition-all"
            />
          ) : (
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <span
          className="hidden md:block text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]"
        >
          {user?.fullName || "User"}
        </span>
      </div>
      
      {/* Center - Search (Desktop only) */}
      <div
        onClick={() => navigate("/Search")}
        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-all w-64"
      >
        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span className="text-sm text-slate-400">Search users...</span>
      </div>

      {/* Right — nav icons */}
      <nav className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => navigate("/Search")}
          className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        
        <button
          onClick={toggleTheme}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <FiSun size={20} className="text-amber-500" /> : <FiMoon size={20} className="text-violet-600" />}
        </button>

        <button
          onClick={() => navigate("/Messages")}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <MdOutlineMessage size={20} />
        </button>

        <button
          onClick={() => navigate("/Whatnew")}
          className="hidden sm:flex w-10 h-10 rounded-lg items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 transition-colors"
        >
          <RiMegaphoneLine size={20} />
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <button
          onClick={handleLogout}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
        >
          <FiLogOut size={19} />
        </button>
      </nav>
    </header>
  );
}
