import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import chatApi from "../../api/chatApi";
import { useAuth } from "../../auth/useAuth";
import "./ChatPage.scss";
import botJyotiImage from "../../assets/Logo/BotJyoti.jpeg";

interface Message {
  message: string;
  role: "user" | "assistant";
}

const initialMessages: Message[] = [
  {
    message:
      "Welcome to Career Bot! I'm here to help you navigate your career journey. I can assist you with career guidance, education paths, skill development, and job opportunities.",
    role: "assistant",
  },
  {
    message:
      "To get started, feel free to ask me anything about careers, education, or professional development. What would you like to know?",
    role: "assistant",
  },
];

const ChatPage: React.FC = () => {
  const { logout, user } = useAuth();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName] = useState<string>(user?.firstName || "User");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as FormEvent);
    }
  };

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    // Add user message
    const userMessage: Message = {
      message: trimmedMessage,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      const botResponseText = await chatApi.sendChatMessage({
        chat_group_id: null,
        isNewChat: true,
        message: trimmedMessage,
      });

      const botMessage: Message = {
        message: botResponseText.data?.assistant_message.message || "",
        role: "assistant",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error("Error getting bot response:", error);

      const errorMessage: Message = {
        message: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div className="chat-container">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay sidebar-overlay--visible"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`chat-sidebar ${isSidebarOpen ? "chat-sidebar--open" : ""
            }`}
        >
          <div className="sidebar-header">
            <div className="sidebar-header__logo">
              <img src={botJyotiImage} alt="Bot Jyoti" className="sidebar-header__icon" />
              <h2 className="sidebar-header__title">Career Bot</h2>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-profile__info">
                <div className="user-profile__avatar">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="user-profile__name">{userName}</div>
              </div>
              <button
                className="user-profile__logout"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxvZy1vdXQtaWNvbiBsdWNpZGUtbG9nLW91dCI+PHBhdGggZD0ibTE2IDE3IDUtNS01LTUiLz48cGF0aCBkPSJNMjEgMTJIOSIvPjxwYXRoIGQ9Ik05IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNCIvPjwvc3ZnPg==" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          <header className="chat-header">
            <button
              className="chat-header__menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="chat-header__title">Career Guidance Chat</h1>
            <div className="chat-header__email">
              <a href="mailto:jobshipz@flaunch.io">jobshipz@flaunch.io</a>
            </div>
          </header>

          {/* Messages Container */}
          <div className="messages-container">
            <div className="messages-wrapper">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message message--${message.role === "user" ? "user" : "assistant"
                    }`}
                >
                  <div className="message__avatar">
                    {message.role === "assistant" ? (
                      <img src={botJyotiImage} alt="Bot Jyoti" className="message__avatar-img" />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div className="message__content">
                    <div className="message__bubble">
                      <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-indicator__avatar">
                    <img src={botJyotiImage} alt="Bot Jyoti" className="typing-indicator__avatar-img" />
                  </div>
                  <div className="typing-indicator__dots">
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <textarea
                    ref={textareaRef}
                    className="chat-input"
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={!inputMessage.trim() || isTyping}
                    aria-label="Send message"
                  >
                    ➤
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChatPage;
