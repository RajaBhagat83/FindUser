import { useRecoilState, useRecoilValue } from "recoil";
import { selectedUsers, us } from "../../store/atoms/atom";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../../Components/config";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function ProfilePage({
  setProfile,
  profile,
  ViewingOwnProfile,
  setViewingOwnProfile,
}) {
  const [user, setUser] = useRecoilState(us);
  const selectedUser = useRecoilValue(selectedUsers);
  const displayUser = ViewingOwnProfile ? user : selectedUser || user;
  const [preview, setPreview] = useState(displayUser?.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [usersPost, setUsersPost] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { userId }= useParams();
  console.log("userid of serarc",userId);

  useEffect(() => {
    if (displayUser?.profilePic) setPreview(displayUser.profilePic);
  }, [displayUser?.profilePic]);

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
  }, [displayUser._id]);

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

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">

          {/* Banner */}
          <div className="h-28 bg-violet-700 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
          </div>

          {/* Avatar + actions row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">

              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-violet-100">
                  {preview ? (
                    <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-violet-500 text-3xl font-bold">
                      {displayUser?.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                {ViewingOwnProfile && (
                  <>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center justify-center shadow-sm transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-14">
                { !ViewingOwnProfile && (
                  <button
                    onClick={() => navigate("/Messages")}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    Message
                  </button>
                )}
                {ViewingOwnProfile && (
                  <button
                    onClick={() => {setViewingOwnProfile && setViewingOwnProfile(false); }}
                    className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 text-sm font-medium rounded-xl transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Name + email */}
            <h1 className="text-xl font-semibold text-slate-900 mb-1">{displayUser.fullName}</h1>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {displayUser.email}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-slate-100 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800">{usersPost.length}</div>
                <div className="text-xs text-slate-400 mt-0.5">Posts</div>
              </div>
              <div className="w-px h-8 bg-slate-100"/>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800">—</div>
                <div className="text-xs text-slate-400 mt-0.5">Connections</div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {displayUser.interest?.split(",").map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-medium rounded-full border border-violet-100">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Posts Section ── */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Posts</p>
            <span className="text-xs text-slate-400">{usersPost.length} total</span>
          </div>

          {/* Loading */}
          {postsLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100"/>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-slate-100 rounded-full"/>
                      <div className="h-2.5 w-1/4 bg-slate-50 rounded-full"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-50 rounded-full"/>
                    <div className="h-3 w-3/4 bg-slate-50 rounded-full"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!postsLoading && usersPost.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500">No posts yet</p>
              <p className="text-xs text-slate-400 mt-1">Posts will appear here</p>
            </div>
          )}

          {/* Post cards */}
          {!postsLoading && usersPost.length > 0 && (
            <div className="flex flex-col gap-4">
              {usersPost.map((p, i) => (
                <PostCard key={i} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-3">
            <svg className="w-6 h-6 animate-spin text-violet-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <p className="text-sm font-medium text-slate-600">Uploading photo...</p>
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
            <img src={p.profilePic} alt={p.fullName} className="w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-violet-500 font-bold text-sm">
              {p.fullName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900">{p.fullName}</span>
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
          <img src={p.postPic} alt="post" className="w-full max-h-72 object-contain bg-slate-50"/>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-slate-100">
        <button
          onClick={() => { setLiked(!liked); setLikes((l) => liked ? l - 1 : l + 1); }}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${liked ? "text-violet-600 bg-violet-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Comment
        </button>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}