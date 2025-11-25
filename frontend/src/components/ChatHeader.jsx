import { X } from "lucide-react";
import { useAuthStore } from "../store/Auth.Store.js";
import { useMessageStore } from "../store/Message.Store.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useMessageStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) {
    return null; 
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/profilePic.jpg"}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button className="hover:bg-amber-50" onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;