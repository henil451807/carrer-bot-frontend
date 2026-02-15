import axios from "axios";
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { IoLogOutOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import chatApi from "../../api/chatApi";
import logo1M1B from "../../assets/Logo/1M1BLogo.png";
import botJyotiImage from "../../assets/Logo/BotJyoti.jpeg";
import jobShipzLogo from "../../assets/Logo/JobShipzLogo.png";
import { useAuth } from "../../auth/useAuth";
import ContactMenu from "../../Comps/ContactMenu/ContactMenu";
import LanguageToggle from "../../Comps/LanguageToggle/LanguageToggle";
import SupportMenu from "../../Comps/SupportMenu/SupportMenu";
import "./ChatPage.scss";

interface Message {
  message: string;
  role: "user" | "assistant";
  image?: string;
}

// Add these new state types
type LoadingState = "idle" | "loading" | "error";

interface ErrorState {
  type: "chat_load" | "send_message" | "chat_history" | null;
  message: string;
}

const initialMessages: Message[] = [
  {
    message: "",
    role: "assistant",
    image: botJyotiImage,
  },
  {
    message:
      "Hi, I’m JYOTI — an AI-powered Career & Youth Opportunity Assistant, here to guide your professional journey.",
    role: "assistant",
  },

  {
    message:
      "Welcome to Career Jyoti! I'm here to help you navigate your career journey. I can assist you with career guidance, education paths, skill development, and job opportunities.",
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
  const [language, setLanguage] = useState<"English" | "Hindi">(() => {
    // Initialize from user profile, default to English
    const userLanguage = user?.chat_language;
    if (userLanguage === "hindi") return "Hindi";
    return "English";
  });

  const toggleLanguage = async () => {
    const newLanguage = language === "English" ? "Hindi" : "English";
    setLanguage(newLanguage);

    // Call the API to update language on backend
    if (user?.chat_group_id) {
      try {
        await chatApi.updateChatLanguage(
          user.chat_group_id,
          newLanguage.toLowerCase()
        );
      } catch (error) {
        console.error("Error updating chat language:", error);
        // Optionally revert language on error
        // setLanguage(language);
      }
    }
  };

  // const [isOpen, setIsOpen] = useState(false);

  // const toggleTooltip = () => setIsOpen(!isOpen);

  // New loading and error states
  const [chatLoadingState, setChatLoadingState] =
    useState<LoadingState>("idle");
  const [error, setError] = useState<ErrorState>({ type: null, message: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const fetchedRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(initialMessages);
    setChatLoadingState("idle");
    setError({ type: null, message: "" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (!user?.chat_group_id) return;

      setChatLoadingState("loading");
      setError({ type: null, message: "" });
      setMessages(initialMessages);

      try {
        const chatDetails = await chatApi.getChatDetails(user.chat_group_id);
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
      }
    };

    fetchChatDetails();
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const target = e.target;
    setInputMessage(target.value);

    // Reset height to auto to get the correct scrollHeight when shrinking
    target.style.height = "auto";

    // Set the height based on scrollHeight
    const newHeight = target.scrollHeight;
    target.style.height = `${newHeight}px`;

    // Toggle scroll class based on max-height (150px)
    if (newHeight > 150) {
      target.classList.add("has-scroll");
    } else {
      target.classList.remove("has-scroll");
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

    // Reset textarea height and scrolling state
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.classList.remove("has-scroll");
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      const botResponseText = await chatApi.sendChatMessage({
        chat_group_id: user?.chat_group_id ?? null,
        isNewChat: user?.chat_group_id ? false : true,
        message: trimmedMessage,
      });

      // if (!user?.chat_group_id) {
      //   const chatDetails = await chatApi.getChatDetails(
      //     botResponseText.data?.chat_group_id || "",
      //   );

      //   setPageTitle(chatDetails.data.title);
      //   navigate(`/chat/${botResponseText.data?.chat_group_id}`, {
      //     replace: true,
      //   });
      //   getChatHistory();
      //   setCurrentChatId(botResponseText.data?.chat_group_id);
      // }

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

  // const handleNewChat = (): void => {
  //   fetchedRef.current = null;
  //   navigate("/chat");
  //   setIsSidebarOpen(false);
  // };

  // const handleLoadChat = (chatId: string): void => {
  //   setIsSidebarOpen(false);
  //   navigate(`/chat/${chatId}`);
  // };

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

  // const handleRetryLoadChat = () => {
  //   if (chatId) {
  //     fetchedRef.current = null; // Reset fetch ref to allow retry
  //     fetchChatDetails();
  //   }
  // };

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
              <img
                src={botJyotiImage}
                alt="Bot Jyoti"
                className="sidebar-header__icon"
              />
              <h2 className="sidebar-header__title">Career Jyoti</h2>
            </div>
          </div>

          <LanguageToggle language={language} onToggle={toggleLanguage} />

          <div className="sidebar-footer">
            <SupportMenu />
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <IoLogOutOutline className="logout-icon" />
              <span className="logout-text">Log out</span>
            </button>
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
            <div className="chat-header__title-container">
              <img
                src={logo1M1B}
                alt="1M1B"
                className="chat-header__logo chat-header__logo--left"
              />
              <h1 className="chat-header__title">Career Jyoti : Your Digitial Margdarshak</h1>
              <img
                src={jobShipzLogo}
                alt="JobShipz"
                className="chat-header__logo chat-header__logo--right"
              />
            </div>
            <div className="chat-header__actions">
              <ContactMenu />
              <button
                className="header-logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >
                <IoLogOutOutline />
              </button>
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
                      <img
                        src={botJyotiImage}
                        alt="Bot Jyoti"
                        className="message__avatar-img"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div className="message__content">
                    <div className="message__bubble">
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Bot"
                          className="message-image"
                        />
                      )}
                      {message.message && (
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-indicator__avatar">
                    <img
                      src={botJyotiImage}
                      alt="Bot Jyoti"
                      className="typing-indicator__avatar-img"
                    />
                  </div>
                  <div className="typing-indicator__dots">
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                    <div className="typing-indicator__dot"></div>
                  </div>
                </div>
              )}

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
