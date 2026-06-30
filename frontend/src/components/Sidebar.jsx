import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Loader } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const onlineCount = Math.max(0, onlineUsers.filter(id => id !== authUser?._id).length);

  return (
    <aside className="h-full w-full flex flex-col">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary" />
          <span className="font-medium">Contacts</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm select-none">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineCount} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 divide-y divide-base-300/40 flex-1">
        {isUsersLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Loader className="size-6 animate-spin text-primary" />
            <span className="text-xs text-base-content/40">Loading contacts...</span>
          </div>
        ) : (
          <>
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-200 transition-all duration-150
                  ${selectedUser?._id === user._id ? "bg-base-300" : ""}
                `}
              >
                <div className="relative">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full border border-base-300 shadow-sm"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3.5 bg-green-500 
                      rounded-full ring-2 ring-base-100"
                    />
                  )}
                </div>

                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate text-base-content">{user.fullName}</div>
                  <div className="text-xs text-base-content/50 mt-0.5">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center text-zinc-500 py-8">No online users</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
