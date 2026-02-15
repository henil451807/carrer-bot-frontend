import type {
  ChatDetails,
  ChatHistoryItem,
  SendChatMessage,
  SendChatMessagePayload,
} from "../types/chat.types";
import axiosWrapper from "./axios";

class ChatApi {
  async sendChatMessage(payload: SendChatMessagePayload): Promise<{
    status: number;
    error: boolean;
    data: SendChatMessage;
    message: string;
  }> {
    const response = await axiosWrapper.post(`chat/message`, payload);
    return response.data;
  }

  async getChatDetails(chatId: string): Promise<{
    status: number;
    error: boolean;
    data: ChatDetails;
    message: string;
  }> {
    const response = await axiosWrapper.get(`chat/group/${chatId}`);
    return response.data;
  }

  async getChatHistory(): Promise<{
    status: number;
    error: boolean;
    data: Array<ChatHistoryItem>;
    message: string;
  }> {
    const response = await axiosWrapper.get(`chat/groups`);
    return response.data;
  }

  async updateChatLanguage(chatGroupId: string, language: string): Promise<{
    status: number;
    error: boolean;
    data: any;
    message: string;
  }> {
    const response = await axiosWrapper.put(
      `chat/language?chat_group_id=${chatGroupId}&chat_language=${language}`
    );
    return response.data;
  }
}

const chatApi = new ChatApi();
export default chatApi;
