import React, { useState } from 'react'
import { useAuthStore } from '../store/Auth.Store';
import { Camera, User, Mail, Loader } from 'lucide-react';
function ProfilePage() {

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    firstName: authUser?.firstName || '',
    lastName: authUser?.lastName || '',
    email: authUser?.email || '',
    password: authUser?.password || ''
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile({ ...formData, profilePic });
    
  };

  const handleFileChange = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result;
      setProfilePic(base64Image);
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 bg-[hsl(225,25%,16%)]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[hsl(214,9%,69%)]">Profile</h1>
            <p className="mt-2 text-[hsl(214,9%,69%)]">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex flex-col items-center gap-4">
              <div className="relative ">
                <img
                  src={profilePic || authUser?.profilePic || "/profilePic.jpg"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-[hsl(214,9%,69%)]"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                >
                  <div className='bg-[hsl(225,25%,16%)] rounded-2xl p-1'>
                    <Camera className="size-6 text-base-200 text-[hsl(214,9%,69%)] " />
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* first name  */}
            <div className='w-full flex flex-col items-center justify-center gap-4'>
              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text font-medium text-[hsl(214,9%,69%)]">First Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                    placeholder={authUser.firstName || "First name"}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              {/* Last name */}
              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text font-medium mt-6 text-[hsl(214,9%,69%)]" >Last Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                    <User className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                    placeholder={authUser.lastName || "Last Name"}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* email */}

              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text font-medium text-[hsl(214,9%,69%)]">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                    <Mail className="size-5 text-base-content/40 text-[hsl(214,9%,69%)]" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 border-2 rounded border-[hsl(214,9%,69%)] text-[hsl(214,9%,69%)]`}
                    placeholder={authUser.email || "you@example.com"}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary font-medium rounded bg-[hsl(239,42%,59%)] text-black  hover:bg-[hsl(239,42%,69%)] hover:text-black cursor-pointer w-80" disabled={isUpdatingProfile} onClick={handleSubmit}>
                {isUpdatingProfile ? (
                  <>
                    <Loader className="size-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
          {/* account info section */}

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium text-[hsl(214,9%,69%)] mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700 text-[hsl(214,9%,69%)]">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className='text-[hsl(214,9%,69%)]'>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage