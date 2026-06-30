import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { ImagePlus, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="px-2 py-2 sm:px-4 sm:py-3 w-full border-t border-base-300 bg-base-100">
      {imagePreview && (
        <div className="mb-2 flex items-center gap-2 px-1">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error
                         text-white flex items-center justify-center shadow"
            >
              <X className="size-3" />
            </button>
          </div>
          <span className="text-xs text-base-content/50">Image ready to send</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex-shrink-0 flex items-center justify-center
                      w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-colors
                      ${imagePreview
                        ? "bg-primary/20 text-primary"
                        : "bg-base-200 text-base-content/60 hover:bg-base-300"
                      }`}
          title="Send image"
        >
          <ImagePlus size={20} />
        </button>

        <input
          type="text"
          className="flex-1 input input-bordered rounded-full px-4 h-10 sm:h-11 min-h-0 text-sm transition-all"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="flex-shrink-0 flex items-center justify-center
                     w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-primary/80 transition-colors"
          title="Send"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
