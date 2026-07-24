import React, { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../../Components/config";
import { useRecoilState } from "recoil";
import { us, userpost } from "../../store/atoms/atom";
import PostShow from "../input/PostShow.js";
import { MdOutlineMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useFetchMessage } from "../../utils/fetchMessage.js";

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
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
        loading="lazy"
        alt={name}
        onError={() => setError(true)}
        className={`${className} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm flex-shrink-0`}
    >
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

const PostCard = React.memo(function PostCard({ p, fullName }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 20));
  const navigate = useNavigate();
  const fetchMessage = useFetchMessage();
  const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] sm:rounded-3xl sm:border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 overflow-hidden group mb-4 sm:mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-5 pb-2 sm:pb-3">
        <SmartAvatar
          profilePic={p.profilePic}
          name={p.fullName}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[16px] font-bold text-slate-900 dark:text-white cursor-pointer hover:text-violet-600 transition-colors"
              onClick={() => {
                navigate(`/Profile/${p.userId}`);
              }}
            >
              {p.fullName}
            </span>
          </div>
          {p.interest && (
            <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate font-medium">
              {p.interest}
            </p>
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
                profilePic: p.profilePic,
              });
              navigate("/Messages");
            }}
            className="p-2 sm:px-4 sm:py-2 rounded-full sm:rounded-xl text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all flex items-center gap-2 flex-shrink-0 font-semibold text-sm"
          >
            <MdOutlineMessage className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Message</span>
          </button>
        )}
      </div>

      {/* Post text */}
      <div className="px-4 sm:px-6 pb-3 pt-1">
        <p className="text-[16px] sm:text-[17px] text-slate-800 dark:text-slate-200 leading-normal font-normal whitespace-pre-wrap">
          {p.post}
        </p>
      </div>

      {/* Post image */}
      {p.postPic && (
        <div className="w-full bg-slate-50 dark:bg-black/20 border-y border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
          <img
            src={p.postPic}
            loading="lazy"
            alt="post"
            className="w-full h-auto max-h-[500px] md:max-h-[650px] object-contain"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 transition-colors">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes((l) => (liked ? l - 1 : l + 1));
            }}
            className={`flex items-center gap-2 text-[15px] px-3 py-2 rounded-full font-semibold transition-all ${
              liked
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <svg
              className={`w-6 h-6 ${liked ? "fill-current" : "fill-none"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </button>

          <button className="flex items-center gap-2 text-[15px] px-3 py-2 rounded-full font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden sm:inline">Comment</span>
          </button>
        </div>

        <button className="flex items-center gap-2 text-[15px] px-3 py-2 rounded-full font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
});

export default function PostPage() {
  const [user] = useRecoilState(us);
  const [postuser, setUserpost] = useRecoilState(userpost);
  const [canpost, setCanPost] = useState(false);
  const [posting, setPosting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/user/post?limit=10&page=${page}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to load posts: ${response.status}`);
        }
        const res = await response.json();
        const nextPosts = Array.isArray(res) ? res : [];
        console.log("post repo", nextPosts);
        if (nextPosts.length < 10) {
          setHasMore(false);
        }
        setUserpost((prev) => [...prev, ...nextPosts]);
      } catch (error) {
        console.error("Error while fetching posts:", error);
      } finally {
        setIsFetching(false);
        isFetchingRef.current = false;
      }
    })();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingRef.current || !hasMore) return;

      const scrollTop =
        window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + viewportHeight >= fullHeight - 250) {
        isFetchingRef.current = true;
        setIsFetching(true);
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore]);

  return (
    <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 py-2 sm:py-6 flex flex-col gap-2 sm:gap-6">
      {/* PostShow modal */}
      {canpost && (
        <PostShow
          canpost={canpost}
          setCanPost={setCanPost}
          setPosting={setPosting}
        />
      )}

      {/* Write a post trigger bar */}
      <div className="px-3 sm:px-0">
        <div
          className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-full sm:rounded-2xl p-2 sm:p-4 shadow-sm cursor-pointer hover:border-violet-300 transition-all duration-300 group"
          onClick={() => setCanPost(true)}
        >
          <SmartAvatar
            profilePic={user?.profilePic}
            name={user?.fullName}
            className="w-10 h-10 ml-1 sm:ml-0"
          />
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-full sm:rounded-xl px-4 py-2.5 text-[15px] text-slate-500 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors truncate">
            What's on your mind?
          </div>
          <button className="hidden sm:block text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 px-6 py-2.5 rounded-xl shadow-md transition-all">
            Post
          </button>
        </div>
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
      {postuser?.length > 0 && (
        <div className="flex-1 flex flex-col gap-6 pb-12">
          {postuser.map((p) => (
            <PostCard key={p._id} p={p} fullName={user?.fullName} />
          ))}
        </div>
      )}
    </div>
  );
}
