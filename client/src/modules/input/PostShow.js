import { useRecoilState } from "recoil";
import { us, userpost } from "../../store/atoms/atom";
import { useState, useRef } from "react";
import { BACKEND_URL } from "../../Components/config";

export default function PostShow({ canpost, setCanPost, setPosting: setParentPosting }) {
  const [user] = useRecoilState(us);
  const [post, setPost] = useState("");
  const [postuser, setUserpost] = useRecoilState(userpost);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);

  async function sendPost() {
    if (!post.trim()) return;
    setPosting(true);

    const formdata = new FormData();
    formdata.append("fullName", user.fullName);
    formdata.append("interest", user.interest);
    formdata.append("profilePic", user.profilePic || "");
    formdata.append("post", post);
    if (image) formdata.append("image", image);

    try {
      await fetch(`${BACKEND_URL}/user/upload/upload-post/${user._id}`, {
        method: "POST",
        body: formdata,
      });
      setPost("");
      setImage(null);
      if (setParentPosting) setParentPosting(true); // show skeleton in PostPage
      setCanPost(false);
      const allpost = await fetch(`${BACKEND_URL}/user/post`);
      const res = await allpost.json();
      setUserpost(res);
    } catch (err) {
      console.log("error while sending post:", err.message);
    } finally {
      setPosting(false);
      if (setParentPosting) setParentPosting(false); // hide skeleton in PostPage
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={() => setCanPost(false)}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl transition-all duration-200 ${
          isFocused ? "shadow-2xl scale-[1.01]" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.fullName || "You"}</p>
            <p className="text-xs text-gray-400">Share with your network</p>
          </div>
          <button
            onClick={() => setCanPost(false)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Textarea */}
        <div className="px-5 py-4">
          <textarea
            value={post}
            placeholder="What's on your mind?"
            onChange={(e) => setPost(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={4}
            disabled={posting}
            className="w-full resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Image preview */}
        {image && (
          <div className="px-5 pb-3 relative">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full max-h-48 object-cover rounded-xl border border-slate-100"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-7 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5 pt-2 border-t border-gray-100">
          {/* Image upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              name="image"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={posting}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors duration-150 group disabled:opacity-40 disabled:cursor-not-allowed"
              title="Upload image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-150"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs font-medium">Photo</span>
            </button>
          </div>

          {/* Char count + Post button */}
          <div className="flex items-center gap-3">
            {post.length > 0 && (
              <span className={`text-xs tabular-nums ${post.length > 280 ? "text-red-400" : "text-gray-300"}`}>
                {post.length}/300
              </span>
            )}
            <button
              onClick={sendPost}
              disabled={!post.trim() || posting}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-150 ${
                post.trim() && !posting
                  ? "bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-sm cursor-pointer"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              {posting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Posting…
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}