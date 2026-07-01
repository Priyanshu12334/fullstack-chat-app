import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, AtSign, AlignLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [username, setUsername] = useState(authUser?.username || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  useEffect(() => {
    if (authUser) {
      setFullName(authUser.fullName || "");
      setUsername(authUser.username || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      return toast.error("Full name is required");
    }
    
    if (!username.trim()) {
      return toast.error("Username is required");
    }

    const usernameRegex = /^[a-z0-9_.]+$/;
    if (!usernameRegex.test(username.trim().toLowerCase())) {
      return toast.error("Username can only contain lowercase letters, numbers, underscores, and dots");
    }

    await updateProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
    });
  };

  const formatMemberSinceDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "-";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-base-100 text-base-content transition-colors duration-300">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-8 border border-base-300 shadow-xl">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-base-content tracking-tight">Profile Settings</h1>
            <p className="mt-1 text-sm text-base-content/60">Update your account information and public profile</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary text-primary-content hover:scale-105
                  p-2.5 rounded-full cursor-pointer 
                  transition-all duration-200 shadow
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-55" : ""}
                `}
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs text-base-content/50">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveChanges} className="space-y-5">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4.5 h-4.5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm transition-all focus:border-primary"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="w-4.5 h-4.5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm transition-all focus:border-primary"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Bio</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <AlignLeft className="w-4.5 h-4.5 text-base-content/40" />
                </div>
                <textarea
                  className="textarea textarea-bordered min-h-20 w-full pl-10 pt-3 rounded-xl text-sm transition-all focus:border-primary resize-none"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={150}
                />
              </div>
              <div className="flex justify-between items-center mt-1 px-1">
                <span className="text-[10px] text-base-content/40">Optional. Maximum 150 characters.</span>
                <span className="text-[10px] text-base-content/40">{bio.length}/150</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Email Address (Read-only)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4.5 h-4.5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered h-11 w-full !pl-10 rounded-xl text-sm bg-base-200/50 cursor-not-allowed opacity-80"
                  value={authUser?.email || ""}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn btn-primary h-11 min-h-0 w-full rounded-xl text-sm font-semibold mt-4 transition-all hover:opacity-90 flex items-center justify-center gap-2"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>

          {/* Account Metadata */}
          <div className="bg-base-200/30 rounded-xl p-4 border border-base-300/50">
            <h2 className="text-sm font-semibold text-base-content mb-3">Account details</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-base-300/30">
                <span className="text-base-content/60">Member since</span>
                <span className="font-medium">{formatMemberSinceDate(authUser?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-base-content/60">Account status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
