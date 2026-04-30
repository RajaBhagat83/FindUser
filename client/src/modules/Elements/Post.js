import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Components/config";
import { useRecoilState } from "recoil";
import { us, userpost } from "../../store/atoms/atom";
import PostShow from "../input/PostShow.js";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useFetchMessage } from "../../utils/fetchMessage.js";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function getAvatarColor(name = "") {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}


function SmartAvatar({ profilePic, name, className = "w-11 h-11" }) {
  const [error, setError] = useState(false);

  if (profilePic && !error) {
    return (
      <img
        src={profilePic}
        alt={name}
        onError={() => setError(true)}
        className={`${className} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${className} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function PostingSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 p-5 shadow-sm animate-pulse transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-[#1e293b] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/5 bg-slate-200 dark:bg-[#1e293b] rounded-full" />
          <div className="h-2.5 w-1/4 bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
        <div className="h-3 w-4/5 bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
        <div className="h-3 w-3/5 bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
      </div>
    </div>
  );
}

function PostCard({ p, fullName }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 20));
  const navigate = useNavigate();
  const fetchMessage = useFetchMessage();
    const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
  };

  return (
    <div className="bg-white/90 dark:bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-lg hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-md dark:hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-5 pb-3">
        <SmartAvatar profilePic={p.profilePic} name={p.fullName} className="w-12 h-12 shadow-sm dark:shadow-md shadow-black/5 dark:shadow-black/20" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-violet-600 dark:hover:text-white transition-colors" onClick={() =>{
              navigate(`/Profile/${p.userId}`)
            }}>{p.fullName}</span>
            {p.interest && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium border border-violet-200 dark:border-violet-500/20">
                {p.interest}
              </span>
            )}
          </div>
          {p.interest && (
            <p className="text-xs text-slate-500 mt-1 truncate font-medium">{p.interest}</p>
          )}
        </div>

        {/* Message icon — only for other users */}
        {fullName !== p.fullName && (
          <button
            onClick={() => {
              FetchMessages("new", {
                receiverId: p.userId,
                fullName: p.fullName,
                interest: p.interest,
                profilePic: p.profilePic
              });
              navigate("/Messages");
            }}
            className="p-2 rounded-xl text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/20 transition-all flex-shrink-0 border border-transparent hover:border-violet-200 dark:hover:border-violet-500/30"
          >
            <MdOutlineMessage className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Post text */}
      <div className="px-5 pb-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{p.post}</p>
      </div>

      {/* Post image */}
      {p.postPic && (
        <div className="mx-5 mb-5 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0b1120]/50">
          <img src={p.postPic} alt="post" className="w-full max-h-[400px] object-contain" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0b1120]/30 transition-colors duration-300">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikes((l) => (liked ? l - 1 : l + 1));
          }}
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            liked ? "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 shadow-sm shadow-violet-500/5 dark:shadow-violet-500/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes}
        </button>

        <button className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comment
        </button>

        <button className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent ml-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}


export default function PostPage() {
  const [user] = useRecoilState(us);
  const [postuser, setUserpost] = useRecoilState(userpost);
  const [canpost, setCanPost] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      const allpost = await fetch(`${BACKEND_URL}/user/post`);
      const res = await allpost.json();
      setUserpost(res);
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* PostShow modal */}
      {canpost && (
        <PostShow
          canpost={canpost}
          setCanPost={setCanPost}
          setPosting={setPosting}
        />
      )}

      {/* Write a post trigger bar */}
      <div
        className="flex items-center gap-4 bg-white/90 dark:bg-[#0f172a]/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm dark:shadow-lg cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-md dark:hover:shadow-violet-500/20 transition-all duration-300 group"
        onClick={() => setCanPost(true)}
      >
        <SmartAvatar profilePic={user?.profilePic} name={user?.fullName} className="w-10 h-10 shadow-sm dark:shadow-md" />
        <div className="flex-1 bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-[#1e293b] group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          What's on your mind?
        </div>
        <button className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-5 py-2 rounded-xl shadow-md shadow-violet-500/30 transition-all">
          Post
        </button>
      </div>

      {/* Section label */}
      {(posting || postuser?.length > 0) && (
        <div className="flex items-center gap-3 px-1 mt-2">
          <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            Recent posts
          </p>
          <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
        </div>
      )}

      {/* Skeleton while posting */}
      {posting && <PostingSkeleton />}

      {/* Feed */}
      {postuser?.length > 0 &&
       <div className="flex-1 flex flex-col gap-6 pb-12">
        {postuser.map((p, i) => (
          <PostCard key={i} p={p} fullName={user?.fullName} />
        ))}
       </div>}
    </div>
  );
}