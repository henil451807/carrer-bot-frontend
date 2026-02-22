import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import authApi from "../api/authApi";
import type { User } from "../types/user.types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [englishChatGroupId, setEnglishChatGroupId] = useState<string | null>(null);
  const [hindiChatGroupId, setHindiChatGroupId] = useState<string | null>(null);
  const [activeChatGroupId, setActiveChatGroupId] = useState<string | null>(null);
  const [activeChatLanguage, setActiveChatLanguage] = useState<string>("english");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        await fetchUser();
      } catch {
        // Error already handled in fetchUser
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const applyUserChatGroups = (userData: User) => {
    const engId = userData.english_chat_group_id ?? userData.chat_group_id ?? null;
    const hinId = userData.hindi_chat_group_id ?? null;
    setEnglishChatGroupId(engId);
    setHindiChatGroupId(hinId);

    // Restore previously chosen language from localStorage (default: english)
    const savedLanguage = localStorage.getItem("activeChatLanguage") ?? "english";
    if (savedLanguage === "hindi" && hinId) {
      setActiveChatGroupId(hinId);
      setActiveChatLanguage("hindi");
    } else {
      setActiveChatGroupId(engId);
      setActiveChatLanguage("english");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await authApi.getUser();
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        applyUserChatGroups(response.data);
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      setEnglishChatGroupId(null);
      setHindiChatGroupId(null);
      setActiveChatGroupId(null);
      setActiveChatLanguage("english");
      throw error;
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    try {
      await fetchUser();
    } catch (error) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("activeChatLanguage");
    setIsAuthenticated(false);
    setUser(null);
    setEnglishChatGroupId(null);
    setHindiChatGroupId(null);
    setActiveChatGroupId(null);
    setActiveChatLanguage("english");
  };

  /**
   * Switch the active chat group (called on language toggle or sidebar click).
   */
  const setActiveChatGroup = (chatGroupId: string, chatLanguage: string) => {
    setActiveChatGroupId(chatGroupId);
    setActiveChatLanguage(chatLanguage);
    // Persist so the same language is restored after a page refresh
    localStorage.setItem("activeChatLanguage", chatLanguage);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        user,
        activeChatGroupId,
        activeChatLanguage,
        englishChatGroupId,
        hindiChatGroupId,
        setActiveChatGroup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
