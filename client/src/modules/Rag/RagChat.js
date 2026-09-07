import React, { useState } from "react";
import { BACKEND_URL } from "../../Components/config";

export default function RagChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋\nI'm your AI assistant. Ask me anything about our website, products, or services.",
    },
  ]);
  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/Chat/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
        }),
      });

      const res = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: res,
        },
      ]);

    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "Sorry, something went wrong.",
        },
      ]);
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ================= CHAT WINDOW ================= */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-5 z-50
            w-[380px] max-w-[calc(100vw-32px)]
            h-[600px] max-h-[calc(100vh-120px)]
            bg-white
            rounded-3xl
            shadow-2xl
            overflow-hidden
            flex flex-col
            border border-gray-200
            animate-[chatOpen_0.25s_ease-out]
          "
        >
          {/* ================= HEADER ================= */}
          <div
            className="
              bg-gradient-to-r from-blue-600 to-blue-500
              px-5 py-4
              flex items-center justify-between
              text-white
            "
          >
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div
                className="
                  w-12 h-12
                  rounded-full
                  bg-white/20
                  backdrop-blur
                  flex items-center justify-center
                "
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="4" y="7" width="16" height="12" rx="3" />
                  <path d="M12 3v4" />
                  <circle cx="9" cy="12" r="1" fill="white" />
                  <circle cx="15" cy="12" r="1" fill="white" />
                  <path d="M9 16h6" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-lg">Chat Assistant</h2>

                <p className="text-sm text-blue-100">
                  How can I help you today?
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                w-9 h-9
                rounded-full
                hover:bg-white/20
                flex items-center justify-center
                transition
              "
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* ================= MESSAGES ================= */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-4
              space-y-4
              bg-gray-50
            "
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bot avatar */}
                {msg.sender === "bot" && (
                  <div
                    className="
                      w-9 h-9
                      min-w-9
                      rounded-full
                      bg-blue-600
                      flex items-center justify-center
                      mr-2
                    "
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <rect x="4" y="7" width="16" height="12" rx="3" />
                      <path d="M12 3v4" />
                      <circle cx="9" cy="12" r="1" fill="white" />
                      <circle cx="15" cy="12" r="1" fill="white" />
                    </svg>
                  </div>
                )}

                <div
                  className={`
                    max-w-[78%]
                    px-4 py-3
                    rounded-2xl
                    text-sm
                    whitespace-pre-line

                    ${
                      msg.sender === "user"
                        ? `
                          bg-blue-600
                          text-white
                          rounded-br-md
                        `
                        : `
                          bg-white
                          text-gray-800
                          shadow-sm
                          border border-gray-100
                          rounded-bl-md
                        `
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* ================= INPUT ================= */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div
              className="
                flex items-center
                gap-2
                border border-gray-200
                rounded-full
                px-4 py-2
                focus-within:border-blue-500
                focus-within:ring-2
                focus-within:ring-blue-100
                transition
              "
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="
                  flex-1
                  outline-none
                  text-sm
                  text-gray-700
                  placeholder-gray-400
                  bg-transparent
                "
              />

              {/* Send */}
              <button
                onClick={sendMessage}
                // disabled={!message.trim()}
                className="
                  w-10 h-10
                  rounded-full
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-300
                  flex items-center justify-center
                  text-white
                  transition
                  flex-shrink-0
                "
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING CHAT ICON ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="
            fixed
            bottom-5
            right-5
            z-50

            w-16
            h-16

            rounded-full

            bg-blue-600
            hover:bg-blue-700

            text-white

            shadow-xl
            hover:shadow-2xl

            flex
            items-center
            justify-center

            transition-all
            duration-300

            hover:scale-105
          "
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.38 8.38 0 01-9 8.5 9.2 9.2 0 01-4-.9L3 21l1.9-4.2A8.4 8.4 0 013 11.5C3 7 7 3 12 3s9 3.5 9 8.5z" />

            <circle cx="8" cy="11.5" r="1" fill="currentColor" />
            <circle cx="12" cy="11.5" r="1" fill="currentColor" />
            <circle cx="16" cy="11.5" r="1" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* Animation */}
      <style>
        {`
          @keyframes chatOpen {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
}
