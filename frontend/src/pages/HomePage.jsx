import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center pt-16 sm:pt-20 sm:px-4 h-full">
        <div className="bg-base-100 rounded-none sm:rounded-lg shadow-xl w-full max-w-6xl
                        h-full sm:h-[calc(100vh-6rem)] overflow-hidden">
          <div className="flex h-full overflow-hidden">
            
            {/* Sidebar: Show on desktop always. On mobile, show only when NO chat is selected */}
            <div className={`h-full ${selectedUser ? "hidden md:flex" : "flex w-full"} md:w-72 lg:w-80 border-r border-base-300 flex-col flex-shrink-0`}>
              <Sidebar />
            </div>

            {/* Chat Area: On mobile, show only when a chat IS selected */}
            <div className={`h-full flex-1 flex-col ${!selectedUser ? "hidden md:flex" : "flex"}`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;

