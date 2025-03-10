import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Chat, User } from "../types";

interface ChatListProps {
  currentUser: string;
  selectedChatId: string | null; // Selected chat ID
  onSelectChat: (chat: Chat) => void;
  onStartNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  currentUser,
  selectedChatId,
  onSelectChat,
  onStartNewChat,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userDetails, setUserDetails] = useState<{ [id: string]: User }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching chats... of user: " + currentUser);
    const fetchChats = async () => {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser),
        orderBy("lastUpdated", "desc")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const chatData: Chat[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Chat[];

          const userIds = Array.from(
            new Set(
              chatData.flatMap((chat) =>
                chat.participants.filter((id) => id !== currentUser)
              )
            )
          );

          const userPromises = userIds.map(async (id) => {
            const userDoc = await getDoc(doc(db, "users", `${id}`));
            if (userDoc.exists()) {
              return { id, ...userDoc.data() } as User;
            }
            return null;
          });

          const users = await Promise.all(userPromises);
          const userMap = users.reduce((acc, user) => {
            if (user) acc[user.id] = user;
            return acc;
          }, {} as { [id: string]: User });

          setUserDetails(userMap);
          setChats(chatData);
        } catch (error) {
          console.error("Error fetching chats:", error);
        } finally {
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    fetchChats();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <button onClick={onStartNewChat} className="btn btn-primary mb-4">
        Start New Chat
      </button>
      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <ul>
          {chats.map((chat) => {
            const recipientId = chat.participants.find((id) => id !== currentUser);
            const recipient = recipientId ? userDetails[recipientId] : null;
            const isUnread = chat.unreadMessages?.[currentUser] > 0;
            const isSelected = selectedChatId === chat.id;

            return (
              <li
                key={chat.id}
                className={`p-2 rounded mb-2 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white" // Selected chat style
                    : isUnread
                    ? "bg-gray-100 font-semibold text-black" // Unread chat style
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200" // Default chat style
                }`}
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex justify-between items-center">
                  <span>{recipient ? recipient.name : "Unknown User"}</span>
                  {chat.unreadMessages?.[currentUser] > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unreadMessages[currentUser]}
                    </span>
                  )}
                </div>
                <p className="text-sm truncate">{chat.lastMessage}</p>
                <p className="text-xs">
                  {chat.lastUpdated?.toDate().toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
