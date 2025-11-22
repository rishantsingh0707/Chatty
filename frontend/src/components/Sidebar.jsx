import React, { useEffect, useState } from 'react'
import { useMessageStore } from '../store/Message.Store.js';
import { useAuthStore } from '../store/Auth.Store.js';
import SidebarSkeletons from './skeletons/SidebarSkeletons.jsx';
import { Users } from 'lucide-react';

function Sidebar() {
  const { users = [], isUserloading, selectedUser, getUser, setSelectedUser } = useMessageStore();
  const { onlineUsers = [] } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isUserloading) return <SidebarSkeletons />;

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col rounded-xl transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-3">
          <label
            className="flex items-center gap-3 cursor-pointer select-none"
            aria-label="Show online only toggle"
            title="Filter to show only online contacts"
          >
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-sm "
              aria-checked={showOnlineOnly}
            />
            <span className="text-sm font-medium">Show online only</span>
          </label>

          <span className="text-xs text-zinc-500" aria-live="polite">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            aria-pressed={selectedUser?._id === user._id}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors rounded-xl
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/profilePic.jpg"}
                alt={user.firstName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                className="w-12 h-12 object-cover rounded-full border-2"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100 dark:ring-zinc-900"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? 'No online users' : 'No users found'}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar
