import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchParams } from "react-router-dom";
import { Users, Loader, Search, X } from "lucide-react";

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    isUsersLoading,
    searchQuery,
    searchResults,
    isSearching,
    searchUsersByUsername,
    clearSearch
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const onlineCount = Math.max(0, onlineUsers.filter(id => id !== authUser?._id).length);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    searchUsersByUsername(val);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    clearSearch();
  };

  return (
    <aside className="h-full w-full flex flex-col">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <span className="font-medium">Contacts</span>
          </div>
          <span className="text-xs text-zinc-500">({onlineCount} online)</span>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-base-content/40" />
          </div>
          <input
            type="text"
            className="input input-bordered h-9 w-full pl-9 pr-8 rounded-xl text-xs transition-all focus:border-primary"
            placeholder="Search by username..."
            value={searchVal}
            onChange={handleSearchChange}
          />
          {searchVal && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
              disabled={!!searchVal.trim()}
            />
            <span className="text-sm select-none">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 divide-y divide-base-300/40 flex-1">
        {searchVal.trim() ? (
          <>
            <div className="px-5 py-2 text-xs font-semibold text-base-content/40 tracking-wider">
              Search Results
            </div>
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader className="size-5 animate-spin text-primary" />
                <span className="text-xs text-base-content/40">Searching users...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-zinc-500 py-8 text-sm">No users found</div>
            ) : (
              searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSearchParams({ chat: user._id });
                    handleClearSearch();
                  }}
                  className={`
                    w-full p-3 flex items-center gap-3
                    hover:bg-base-200 transition-all duration-150
                    ${selectedUser?._id === user._id ? "bg-base-300" : ""}
                  `}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
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
                    <div className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1.5">
                      <span className="text-primary font-medium">@{user.username}</span>
                      <span className="text-base-content/30">•</span>
                      <span>{onlineUsers.includes(user._id) ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        ) : (
          <>
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSearchParams({ chat: user._id })}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-200 transition-all duration-150
                  ${selectedUser?._id === user._id ? "bg-base-300" : ""}
                `}
              >
                <div className="relative">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
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
                  <div className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1.5">
                    <span className="text-primary/70 font-medium">@{user.username}</span>
                    <span className="text-base-content/30">•</span>
                    <span>{onlineUsers.includes(user._id) ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </button>
            ))}

            {filteredUsers.length === 0 && !isUsersLoading && (
              <div className="text-center text-zinc-500 py-8">No online users</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
