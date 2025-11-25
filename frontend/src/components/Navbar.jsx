import { Link } from "react-router-dom";
import { useAuthStore } from "../store/Auth.Store";
import { useThemeStore } from "../store/useTheme.Store";
import { LogOut, MessageSquare, User, Sun, Moon, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const { logout, authUser, addFriend, removeFriend } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Enter valid 6-digit code");
      return;
    }

    try {
      const res = await axiosInstance.get(`/users/search/${code}`);
      console.log("Search result:", res);
      setResult(res.data);
      toast.success(`Found: ${res.data.firstName} ${res.data.lastName}`);
    } catch (error) {
      console.log("Search error:", error);
      toast.error(error.response?.data?.message || "User not found");
      setResult(null);
    }
  };

  const isFriend = result && authUser?.friends?.includes(result._id);

  const handleAdd = () => {
    addFriend(result._id);
  };

  const handleRemove = () => {
    removeFriend(result._id);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center w-[300px] lg:w-[380px] relative">
            <div className="relative w-full">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit friend code"
                className="input input-bordered w-full pl-10 h-10"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-base-content/60" />
            </div>

            {/* Result Popup */}
            {result && (
              <div className="absolute top-12 bg-base-200 shadow-xl p-4 rounded-lg w-full border border-base-300">
                <div className="flex items-center gap-3">
                  <img
                    src={result.profilePic || "/profilePic.jpg"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {result.firstName} {result.lastName}
                    </p>
                    <p className="text-xs opacity-70">
                      Code: {result.uniqueCode}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  {isFriend ? (
                    <button onClick={handleRemove} className="btn btn-error btn-sm">
                      Remove
                    </button>
                  ) : (
                    <button onClick={handleAdd} className="btn btn-primary btn-sm">
                      Add
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            <button className="btn btn-sm" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
