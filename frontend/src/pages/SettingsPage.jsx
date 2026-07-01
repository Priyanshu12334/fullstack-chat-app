import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Github, Linkedin, Instagram, Mail } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 pb-10 max-w-5xl">
      <div className="space-y-6">

        {/* Theme heading */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="rounded-xl border border-base-300 overflow-hidden shadow-lg">

            {/* Mock Chat UI — all bg-base-100 so it always matches the active theme */}
            <div className="bg-base-100">

              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Your Name</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-xl p-3 shadow-sm
                        ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          message.isSent ? "text-primary-content/70" : "text-base-content/70"
                        }`}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-base-300 bg-base-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-0">
                    <Send size={18} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Support & Contact Section */}
        <div className="bg-base-200/30 backdrop-blur-sm rounded-xl p-6 border border-base-300/80 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-base-content flex items-center gap-2">
            Support & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-base text-base-content">Priyanshu Suyal</h4>
                <p className="text-xs text-primary font-medium">Full Stack Developer</p>
              </div>
              <p className="text-sm text-base-content/75 leading-relaxed">
                Need help, found a bug, or have feedback? Feel free to reach out.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="https://github.com/Priyanshu12334"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline gap-2 rounded-xl text-xs"
                >
                  <Github size={14} />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/priyanshu-suyal-5732b224a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline gap-2 rounded-xl text-xs"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/priyanshu_suyal_?igsh=MW54MmNqYzhyeTlpOA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline gap-2 rounded-xl text-xs"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
                <a
                  href="mailto:suyalpriyanshu2@gmail.com"
                  className="btn btn-sm btn-outline gap-2 rounded-xl text-xs"
                >
                  <Mail size={14} />
                  Email
                </a>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-3 border-t md:border-t-0 md:border-l border-base-300 pt-4 md:pt-0 md:pl-6 text-sm">
              <div className="flex items-center gap-2.5 text-base-content/85">
                <Mail className="size-4 text-primary" />
                <a href="mailto:suyalpriyanshu2@gmail.com" className="hover:underline hover:text-primary">
                  suyalpriyanshu2@gmail.com
                </a>
              </div>
              <div className="text-xs text-base-content/50 leading-normal">
                Direct feedback, issues, and inquiries are always welcome. Connect on social media or send an email directly.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SettingsPage;
