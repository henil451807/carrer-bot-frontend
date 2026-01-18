import axios from "axios";
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import chatApi from "../../api/chatApi";
import { useAuth } from "../../auth/useAuth";
import type { ChatHistoryItem } from "../../types/chat.types";
import "./ChatPage.scss";

interface Message {
  message: string;
  role: "user" | "assistant";
}

// Add these new state types
type LoadingState = "idle" | "loading" | "error";

interface ErrorState {
  type: "chat_load" | "send_message" | "chat_history" | null;
  message: string;
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
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const { logout, user } = useAuth();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Career Guidance Chat");
  const [userName] = useState<string>(user?.firstName || "User");

  // New loading and error states
  const [chatLoadingState, setChatLoadingState] =
    useState<LoadingState>("idle");
  const [error, setError] = useState<ErrorState>({ type: null, message: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fetchedRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  useEffect(() => {
    if (!chatId) {
      fetchedRef.current = null;
      setCurrentChatId(null);
      setPageTitle("Career Guidance Chat");
      setMessages(initialMessages);
      setChatLoadingState("idle");
      setError({ type: null, message: "" });
      return;
    }

    if (fetchedRef.current !== chatId) {
      fetchedRef.current = chatId;
      fetchChatDetails();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatHistory = async () => {
    try {
      const response = await chatApi.getChatHistory();
      if (response.data && Array.isArray(response.data)) {
        setChatHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError({
        type: "chat_history",
        message: "Failed to load chat history. Please refresh the page.",
      });
    }
  };

  const fetchChatDetails = async () => {
    if (!chatId) return;

    setChatLoadingState("loading");
    setError({ type: null, message: "" });
    setMessages(initialMessages); // Show initial message while loading

    try {
      setCurrentChatId(chatId);
      const chatDetails = await chatApi.getChatDetails(chatId);

      setPageTitle(chatDetails.data.title);
      setMessages([...initialMessages, ...(chatDetails.data.messages ?? [])]);
      setChatLoadingState("idle");
    } catch (error: unknown) {
      console.error("Error fetching chat details:", error);
      setChatLoadingState("error");
      if (axios.isAxiosError(error)) {
        setError({
          type: "chat_load",
          message:
            error.response?.data?.message ||
            "Failed to load chat. Please try again.",
        });
      }
      // Optionally redirect to new chat after showing error
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    }
  };

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

    // Clear any previous errors
    setError({ type: null, message: "" });

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
        chat_group_id: chatId ?? null,
        isNewChat: chatId ? false : true,
        message: trimmedMessage,
      });

      if (!chatId) {
        const chatDetails = await chatApi.getChatDetails(
          botResponseText.data?.chat_group_id || ""
        );

        setPageTitle(chatDetails.data.title);
        navigate(`/chat/${botResponseText.data?.chat_group_id}`, {
          replace: true,
        });
        getChatHistory();
        setCurrentChatId(botResponseText.data?.chat_group_id);
      }

      const botMessage: Message = {
        message: botResponseText.data?.assistant_message.message || "",
        role: "assistant",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error("Error getting bot response:", error);

      if (axios.isAxiosError(error)) {
        setError({
          type: "send_message",
          message:
            error.response?.data?.message ||
            "Failed to send message. Please try again.",
        });
      }

      const errorMessage: Message = {
        message: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = (): void => {
    fetchedRef.current = null;
    navigate("/chat");
    setIsSidebarOpen(false);
  };

  const handleLoadChat = (chatId: string): void => {
    setIsSidebarOpen(false);
    navigate(`/chat/${chatId}`);
  };

  const handleLogout = (): void => {
    // if (window.confirm("Are you sure you want to logout?")) {
    logout();
    // }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  //   const formatTime = (date: Date): string => {
  //     const now = new Date();
  //     const diff = now.getTime() - date.getTime();
  //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  //     if (days === 0) {
  //       return date.toLocaleTimeString("en-US", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       });
  //     } else if (days === 1) {
  //       return "Yesterday";
  //     } else if (days < 7) {
  //       return `${days} days ago`;
  //     } else {
  //       return date.toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       });
  //     }
  //   };

  const handleRetryLoadChat = () => {
    if (chatId) {
      fetchedRef.current = null; // Reset fetch ref to allow retry
      fetchChatDetails();
    }
  };

  return (
    <>
      <div className="chat-container">
        {/* Error Banner */}
        {error.type && (
          <div className="error-banner">
            <div className="error-banner__content">
              <span className="error-banner__icon">⚠️</span>
              <div className="error-banner__text">
                <div className="error-banner__title">Error</div>
                <div className="error-banner__message">{error.message}</div>
              </div>
              <button
                className="error-banner__close"
                onClick={() => setError({ type: null, message: "" })}
                aria-label="Close error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay sidebar-overlay--visible"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`chat-sidebar ${
            isSidebarOpen ? "chat-sidebar--open" : ""
          }`}
        >
          <div className="sidebar-header">
            <div className="sidebar-header__logo">
              <div className="sidebar-header__icon">🤖</div>
              <h2 className="sidebar-header__title">Career Bot</h2>
            </div>
            <button className="new-chat-btn" onClick={handleNewChat}>
              <span>➕</span>
              <span>New Chat</span>
            </button>
          </div>

          <div className="chat-history">
            <h3 className="chat-history__title">Recent Chats</h3>
            {chatHistory.length === 0 ? (
              // Show skeleton loaders if no history yet
              <>
                <div className="skeleton-loader">
                  <div className="skeleton-loader__title"></div>
                  <div className="skeleton-loader__preview"></div>
                </div>
                <div className="skeleton-loader">
                  <div className="skeleton-loader__title"></div>
                  <div className="skeleton-loader__preview"></div>
                </div>
              </>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-history-item ${
                    chat.id === currentChatId ? "chat-history-item--active" : ""
                  }`}
                  onClick={() => handleLoadChat(chat.id)}
                >
                  <div className="chat-history-item__title">{chat.title}</div>
                  {/* <div className="chat-history-item__preview">
                    {chat.lastMessage}
                  </div>
                  <div className="chat-history-item__time">
                    {formatTime(chat.timestamp)}
                  </div> */}
                </div>
              ))
            )}
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
            <h1 className="chat-header__title">{pageTitle}</h1>
          </header>

          {/* Messages Container */}
          <div className="messages-container">
            <div className="messages-wrapper">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message message--${
                    message.role === "user" ? "user" : "assistant"
                  }`}
                >
                  <div className="message__avatar">
                    {message.role === "assistant" ? "🤖" : "👤"}
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
                  <div className="typing-indicator__avatar">🤖</div>
                  <div className="typing-indicator__dots">
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                  </div>
                </div>
              )}

              {/* Inline Loading State - After messages */}
              {chatLoadingState === "loading" && (
                <div className="message message--assistant">
                  <div className="message__avatar">🤖</div>
                  <div className="message__content">
                    <div className="message__bubble">
                      <div className="typing-indicator__dots">
                        <div className="typing-indicator__dot"></div>
                        <div className="typing-indicator__dot"></div>
                        <div className="typing-indicator__dot"></div>
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.875rem",
                          opacity: 0.7,
                        }}
                      >
                        Loading chat...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Error State - After messages */}
              {chatLoadingState === "error" && (
                <div className="message message--assistant">
                  <div className="message__avatar">⚠️</div>
                  <div className="message__content">
                    <div
                      className="message__bubble"
                      style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                        Failed to load chat
                      </div>
                      <div
                        style={{ fontSize: "0.875rem", marginBottom: "1rem" }}
                      >
                        {error.message}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={handleRetryLoadChat}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#dc2626",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Retry
                        </button>
                        <button
                          onClick={handleNewChat}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "none",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          New Chat
                        </button>
                      </div>
                    </div>
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
                    disabled={isTyping || chatLoadingState === "loading"}
                  />
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={
                      !inputMessage.trim() ||
                      isTyping ||
                      chatLoadingState === "loading"
                    }
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
