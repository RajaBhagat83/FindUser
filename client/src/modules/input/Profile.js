import { useRecoilState, useRecoilValue } from "recoil";
import { selectedUsers, us, ViewingOwnProfiles } from "../../store/atoms/atom";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../../Components/config";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFetchMessage } from "../../utils/fetchMessage";
export default function ProfilePage({
  setProfile,
  profile,
  ViewingOwnProfile,
  setViewingOwnProfile,
}) {
  const [user, setUser] = useRecoilState(us);
  const selectedUser = useRecoilValue(selectedUsers);
  const displayUser = ViewingOwnProfile ? user : selectedUser || user;
  const [pageUser, setPageUser] = useState({});
  const [preview, setPreview] = useState(pageUser?.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [usersPost, setUsersPost] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { userId } = useParams();
  const fetchMessage = useFetchMessage();
  useEffect(() => {
    if (pageUser?.profilePic) setPreview(pageUser.profilePic);
  }, [pageUser?.profilePic]);

  useEffect(() => {
    (async () => {
      const user = await fetch(`${BACKEND_URL}/api/users/${userId}`);
      const res = await user.json();
      setPageUser(res.user);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setPostsLoading(true);
        const res = await fetch(`${BACKEND_URL}/user/upload/getpost/${userId}`);
        const data = await res.json();
        setUsersPost(data.Userpost || []);
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    })();
  }, [pageUser._id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", displayUser._id);
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/upload-profile`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPreview(data.profilePic);
        setUser((prev) => {
          const update = { ...prev, profilePic: data.profilePic };
          localStorage.setItem("user:details", JSON.stringify(update));
          return update;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
     const FetchMessages = (conversationId, receiver, openProfile = true) => {
    fetchMessage(conversationId, receiver, true);
  };
  console.log("ViewingOwnProfile", ViewingOwnProfile);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4">
        {/* ── Profile Card ── */}
        <div className="bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl overflow-hidden mb-6 transition-colors duration-300">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-violet-600 to-fuchsia-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Avatar + actions row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#0f172a] shadow-md dark:shadow-xl overflow-hidden bg-violet-100 dark:bg-violet-900/50 transition-colors duration-300">
                  {preview ? (
                    <img
                      src={preview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-violet-500 dark:text-violet-400 text-4xl font-bold bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/50 dark:to-[#0f172a]">
                      {pageUser?.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                {ViewingOwnProfile && (
                  <>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 mt-14 sm:mt-14 w-full sm:w-auto">
                {!ViewingOwnProfile && (
                  <button
                    onClick={() => {
                      FetchMessages("new", {
                        receiverId: pageUser.userId,
                        fullName: pageUser.fullName,
                        interest: pageUser.interest,
                        profilePic: pageUser.profilePic,
                      });
                      navigate("/Messages");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/40 hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    Message
                  </button>
                )}
              </div>
            </div>

            {/* Name + email */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300 text-center sm:text-left mt-10 sm:mt-0">
              {pageUser.fullName}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6 transition-colors duration-300">
              <svg
                className="w-4 h-4 text-violet-500/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {pageUser.email}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 py-4 border-t border-b border-slate-100 dark:border-white/5 mb-6 bg-slate-50/50 dark:bg-white/5 rounded-2xl px-6 transition-colors duration-300">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {usersPost.length}
                </div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest">Posts</div>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">—</div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest">Connections</div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 transition-colors duration-300 text-center sm:text-left">
                Interests
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {displayUser.interest?.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-full border border-violet-200 dark:border-violet-500/20 shadow-sm transition-colors duration-300"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Posts Section ── */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">
              Posts
            </p>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-white/10 px-2.5 py-1 rounded-full transition-colors duration-300">
              {usersPost.length} total
            </span>
          </div>

          {/* Loading */}
          {postsLoading && (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/5 p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-[#1e293b]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-slate-200 dark:bg-[#1e293b] rounded-full" />
                      <div className="h-2.5 w-1/4 bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
                    <div className="h-3 w-3/4 bg-slate-100 dark:bg-[#1e293b]/50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!postsLoading && usersPost.length === 0 && (
            <div className="bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/5 p-12 flex flex-col items-center text-center shadow-sm dark:shadow-xl transition-colors duration-300">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 border border-slate-100 dark:border-transparent">
                <svg
                  className="w-8 h-8 text-slate-300 dark:text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">No posts yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 transition-colors duration-300">
                When they share something, it will appear here.
              </p>
            </div>
          )}

          {/* Post cards */}
          {!postsLoading && usersPost.length > 0 && (
            <div className="flex flex-col gap-5">
              {usersPost.map((p, i) => (
                <PostCard key={i} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl px-8 py-8 shadow-2xl dark:shadow-black/50 border border-slate-100 dark:border-white/10 flex flex-col items-center gap-4 min-w-[200px]">
            <svg
              className="w-8 h-8 animate-spin text-violet-600 dark:text-violet-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Uploading photo...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ p }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 20));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-violet-100 flex-shrink-0">
          {p.profilePic ? (
            <img
              src={p.profilePic}
              alt={p.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-violet-500 font-bold text-sm">
              {p.fullName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900">
              {p.fullName}
            </span>
            {p.interest && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium border border-violet-100">
                {p.interest}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Recently posted</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-700 leading-relaxed">{p.post}</p>
      </div>

      {/* Post image */}
      {p.postPic && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-100">
          <img
            src={p.postPic}
            alt="post"
            className="w-full max-h-72 object-contain bg-slate-50"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-slate-100 justify-between sm:justify-start">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikes((l) => (liked ? l - 1 : l + 1));
          }}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${liked ? "text-violet-600 bg-violet-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Comment
        </button>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
