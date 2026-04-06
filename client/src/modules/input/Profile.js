import { useRecoilState, useRecoilValue } from "recoil";
import { messag, selectedUsers, us } from "../../store/atoms/atom";
import { MailIcon, UserIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";

function profile({
  setProfile,
  profile,
  ViewingOwnProfile,
  setViewingOwnProfile,
}) {
  const [user, setUser] = useRecoilState(us);
  const selectedUser = useRecoilValue(selectedUsers);
  const displayUser = ViewingOwnProfile ? user : selectedUser || user;
  const [preview, setPreview] = useState(displayUser?.profilePic ? `$${BACKEND_URL}/uploads/${displayUser.profilePic}` : "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  console.log("preview", preview);

  useEffect(() => {
    if (displayUser?.profilePic) {
      setPreview(`${displayUser.profilePic}`);
    }
  }, [displayUser?.profilePic]);

  const handleClick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

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
      console.log("image_ur :", data.profilePic);
      if (res.ok) {
        setPreview(data.profilePic);
        setUser((prev) => {
          const update = { ...prev, profilePic: data.profilePic };
          localStorage.setItem("user:details", JSON.stringify(update));
          return update;
        });
        alert("Profile picture updated Successfully");
      } else {
        alert(data.message || "Error uploading profile");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl max-w-md mx-auto mt-32 p-6 fixed inset-0 overflow-hidden z-50 h-96 shadow-sm">

      {/* ── Avatar row */}
      <div className="flex flex-col items-center z-10 relative">
        <div className="relative w-20 h-20 mb-4">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-indigo-400" />
            )}
          </div>
          {ViewingOwnProfile && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 hover:bg-indigo-600 transition-colors shadow-sm"
                title="Upload new profile picture"
              >
                <PlusCircleIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                name="profilePic"
                ref={fileInputRef}
                onChange={handleClick}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
        </div>

        {/* ── Name */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1 tracking-tight">
          {displayUser.fullName}
        </h2>

        {/* ── Email */}
        <div className="flex items-center text-gray-400 text-xs mb-4 gap-1">
          <MailIcon className="w-3.5 h-3.5" /> {displayUser.email}
        </div>

        {/* ── Interests */}
        <div className="w-full mt-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100">
              {displayUser.interest}
            </span>
          </div>
        </div>
      </div>

      {/* ── Close */}
      <div
        className="flex justify-end mt-16 mr-1 cursor-pointer"
        onClick={() => {
          setProfile(!profile);
          setViewingOwnProfile(false);
        }}
      >
        <span className="text-xs text-gray-400 hover:text-red-400 transition-colors">
          close
        </span>
      </div>

      {/* ── Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-2xl">
          <p className="text-indigo-500 text-sm font-medium animate-pulse">
            Uploading...
          </p>
        </div>
      )}
    </div>
  );
}

import { BACKEND_URL } from "../../Components/config";

export default profile;