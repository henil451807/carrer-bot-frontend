export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  is_active: boolean;
  created_at: string;
  // Active chat group (English by default)
  chat_group_id: string;
  chat_language?: string;
  // Language-specific chat group IDs
  english_chat_group_id?: string;
  hindi_chat_group_id?: string;
}
