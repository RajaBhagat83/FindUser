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
    <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-violet-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/5 bg-violet-100 rounded-full" />
          <div className="h-2.5 w-1/4 bg-violet-50 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-violet-50 rounded-full" />
        <div className="h-3 w-4/5 bg-violet-50 rounded-full" />
        <div className="h-3 w-3/5 bg-violet-50 rounded-full" />
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <SmartAvatar profilePic={p.profilePic} name={p.fullName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900 cursor-pointer" onClick={() =>{
              navigate(`/Profile/${p.userId}`)
            }}>{p.fullName}</span>
            {p.interest && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium border border-violet-100">
                {p.interest}
              </span>
            )}
          </div>
          {p.interest && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{p.interest}</p>
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
            className="p-1.5 rounded-lg text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors flex-shrink-0"
          >
            <MdOutlineMessage className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post text */}
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-700 leading-relaxed">{p.post}</p>
      </div>

      {/* Post image */}
      {p.postPic && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-100">
          <img src={p.postPic} alt="post" className="w-full max-h-80 object-contain" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-slate-100">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikes((l) => (liked ? l - 1 : l + 1));
          }}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            liked ? "text-violet-600 bg-violet-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes}
        </button>

        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comment
        </button>

        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4">
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
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm cursor-pointer hover:border-violet-300 hover:shadow-md transition-all"
        onClick={() => setCanPost(true)}
      >
        <SmartAvatar profilePic={user?.profilePic} name={user?.fullName} className="w-9 h-9" />
        <span className="text-sm text-slate-400 flex-1">What's on your mind?</span>
        <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
          Post
        </span>
      </div>

      {/* Section label */}
      {(posting || postuser?.length > 0) && (
        <p className="text-xs text-slate-400 uppercase tracking-widest px-1 font-medium">
          Recent posts
        </p>
      )}

      {/* Skeleton while posting */}
      {posting && <PostingSkeleton />}

      {/* Feed */}
      {postuser?.length > 0 &&
       <div className="flex-1 overflow-y-scroll px-2">
        {postuser.map((p, i) => (
          <PostCard key={i} p={p} fullName={user?.fullName} />
        ))}
       </div>}
    </div>
  );
}