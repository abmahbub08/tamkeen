export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage: string;
  lastUpdated: any;
  unreadMessages: { [userId: string]: number };
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: any;
}

export interface User {
  id: string;
  name: string;
  refercode: string;
  email: string;
}
