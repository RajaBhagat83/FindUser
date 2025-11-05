import { useRecoilState, useRecoilValue } from "recoil";
import { messag, selectedUsers, us } from "../../store/atoms/atom";
import { MailIcon, UserIcon ,PlusCircleIcon} from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";

function profile({
  setProfile,
  profile,
  ViewingOwnProfile,
  setViewingOwnProfile,
}) {
  const [user,setUser] = useRecoilState(us);
  const selectedUser = useRecoilValue(selectedUsers);
  const displayUser = ViewingOwnProfile ? user : selectedUser || user;
  const [preview, setPreview] = useState(displayUser?.profilePic?`http://localhost:8000${displayUser.profilePic}` : "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if(displayUser?.profilePic){
      setPreview(`http://localhost:8000${displayUser.profilePic}?t=${Date.now()}`)
    }
  },[[displayUser?.profilePic]]);

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
      const res = await fetch("http://localhost:8000/api/upload-profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPreview(`http://localhost:8000${data.profilePic}?t=${Date.now()}`);
        setUser(prev => {
          const update = {...prev, profilePic:data.profilePic }

          localStorage.setItem("user:details",JSON.stringify(update));
          return update;
        })
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
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl max-w-md mx-auto mt-32 p-6 fixed inset-0 overflow-hidden z-50 h-96 ">
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-300 opacity-20 rounded-full mix-blend-multiply"></div>
      <div className="flex flex-col items-center z-10 relative">
        <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-full w-24 h-24 flex items-center justify-center shadow-lg mb-3 animate-pulse">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <UserIcon className="w-12 h-12 text-blue-600" />
          )}
        </div>
        {ViewingOwnProfile && (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition"
              title="Upload new profile picture"
            >
              <PlusCircleIcon className="w-6 h-6" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleClick} accept="image/*" className="hidden" />
           </>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
          {displayUser.fullName}
        </h2>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MailIcon className="w-4 h-4 mr-1" /> {displayUser.email}
        </div>
        <div className="w-full mt-2">
          <h3 className="text-md font-semibold text-blue-700 mb-2 uppercase tracking-wider">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">{displayUser.interest}</div>
        </div>
      </div>
      <div
        className="flex h-4 justify-end mt-16 mr-4 cursor-pointer"
        onClick={() => {
          setProfile(!profile);
          setViewingOwnProfile(false);
        }}
      >
        <h2 className="text-red-400">close</h2>
      </div>
       {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-3xl">
          <p className="text-blue-600 font-semibold animate-pulse">
            Uploading...
          </p>
        </div>
      )}
    </div>
  );
}

export default profile;
