import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Mobile Back Button */}
          <button 
            onClick={() => setSelectedUser(null)} 
            className="md:hidden p-1 hover:bg-base-200 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="size-6 text-base-content" />
          </button>

          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-sm sm:text-base">{selectedUser.fullName}</h3>
            <p className="text-xs text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Desktop Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="hidden md:block p-1.5 hover:bg-base-200 rounded-full transition-colors text-base-content/60 hover:text-base-content"
          aria-label="Close chat"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
