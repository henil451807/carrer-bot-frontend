import { createContext } from "react";
import type { User } from "../types/user.types";

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  /** The currently loaded chat group's ID */
  activeChatGroupId: string | null;
  /** The language of the active chat group */
  activeChatLanguage: string;
  /** The English-language dedicated chat group ID */
  englishChatGroupId: string | null;
  /** The Hindi-language dedicated chat group ID */
  hindiChatGroupId: string | null;
  /** Switch the active chat group (called on language toggle or sidebar click) */
  setActiveChatGroup: (chatGroupId: string, chatLanguage: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
