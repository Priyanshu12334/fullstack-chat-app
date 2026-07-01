import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  messagesCache: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    const { messagesCache } = get();
    
    if (messagesCache[userId]) {
      set({ messages: messagesCache[userId], isMessagesLoading: false });
    } else {
      set({ messages: [], isMessagesLoading: true });
    }

    try {
      const res = await api.get(`/messages/${userId}`);
      set((state) => ({
        messages: res.data,
        messagesCache: { ...state.messagesCache, [userId]: res.data }
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, messagesCache } = get();
    const currentUser = useAuthStore.getState().authUser;
    if (!selectedUser || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: messageData.text || "",
      image: messageData.image || null,
      createdAt: new Date().toISOString(),
      isSending: true,
    };

    const updatedMessages = [...messages, optimisticMessage];
    set((state) => ({
      messages: updatedMessages,
      messagesCache: { ...state.messagesCache, [selectedUser._id]: updatedMessages }
    }));

    try {
      const res = await api.post(`/messages/send/${selectedUser._id}`, messageData);
      
      set((state) => {
        const confirmedMessages = state.messages.map((m) =>
          m._id === tempId ? res.data : m
        );
        return {
          messages: confirmedMessages,
          messagesCache: { ...state.messagesCache, [selectedUser._id]: confirmedMessages }
        };
      });
    } catch (error) {
      set((state) => {
        const rollbackMessages = state.messages.filter((m) => m._id !== tempId);
        return {
          messages: rollbackMessages,
          messagesCache: { ...state.messagesCache, [selectedUser._id]: rollbackMessages }
        };
      });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  deleteMessage: async (messageId) => {
    const id = String(messageId);
    const { selectedUser } = get();
    try {
      await api.delete(`/messages/${id}`);
      const filtered = get().messages.filter((m) => String(m._id) !== id);
      set((state) => ({
        messages: filtered,
        messagesCache: selectedUser 
          ? { ...state.messagesCache, [selectedUser._id]: filtered }
          : state.messagesCache
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const updated = [...get().messages, newMessage];
      set((state) => ({
        messages: updated,
        messagesCache: { ...state.messagesCache, [selectedUser._id]: updated }
      }));
    });

    socket.on("messageDeleted", (messageId) => {
      const filtered = get().messages.filter((m) => String(m._id) !== String(messageId));
      set((state) => ({
        messages: filtered,
        messagesCache: { ...state.messagesCache, [selectedUser._id]: filtered }
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  setSelectedUser: (selectedUser) => {
    if (selectedUser) {
      const { users } = get();
      if (!users.some((u) => u._id === selectedUser._id)) {
        set({ users: [selectedUser, ...users] });
      }
    }
    set({ selectedUser });
  },

  searchQuery: "",
  searchResults: [],
  isSearching: false,

  searchUsersByUsername: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: "" });
      return;
    }
    set({ isSearching: true, searchQuery: query });
    try {
      const res = await api.get(`/messages/search?query=${encodeURIComponent(query)}`);
      set({ searchResults: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching users");
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [], searchQuery: "" }),
}));
