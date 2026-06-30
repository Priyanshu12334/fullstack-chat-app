import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [hoveredId, setHoveredId]   = useState(null);
  const [activeId, setActiveId]     = useState(null);
  const longPressTimer               = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMouseEnter = (id, isMine) => {
    if (isMine) setHoveredId(id);
  };
  const handleMouseLeave = () => setHoveredId(null);

  const handleTouchStart = (id, isMine) => {
    if (!isMine) return;
    longPressTimer.current = setTimeout(() => {
      setActiveId(id);
    }, 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleDelete = (e, messageId) => {
    e.stopPropagation();
    if (window.confirm("Delete this message?")) {
      deleteMessage(messageId);
      setActiveId(null);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-auto"
      onClick={() => setActiveId(null)}
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine    = message.senderId === authUser._id;
          const id        = String(message._id);
          const showBtn   = isMine && (hoveredId === id || activeId === id);

          return (
            <div
              key={id}
              className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
              onMouseEnter={() => handleMouseEnter(id, isMine)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(id, isMine)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMine
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`flex items-end gap-2 ${
                  isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex flex-col gap-1 max-w-[280px] ${
                    message.image && !message.text
                      ? "chat-bubble !p-1 !bg-transparent"
                      : ""
                  }`}
                >
                  {message.image && (
                    <a href={message.image} target="_blank" rel="noreferrer">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-lg object-cover hover:opacity-95 transition-opacity"
                        style={{ maxWidth: "280px", maxHeight: "320px", width: "100%" }}
                      />
                    </a>
                  )}
                  {message.text && (
                    <div className="chat-bubble">
                      <p>{message.text}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => handleDelete(e, id)}
                  style={{
                    opacity:    showBtn ? 1 : 0,
                    transform:  showBtn ? "scale(1)" : "scale(0.7)",
                    pointerEvents: showBtn ? "auto" : "none",
                    transition: "opacity 0.18s ease, transform 0.18s ease",
                  }}
                  className="p-1.5 rounded-full bg-base-300 text-error
                             hover:bg-error hover:text-white
                             flex-shrink-0 mb-1 shadow-sm"
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
