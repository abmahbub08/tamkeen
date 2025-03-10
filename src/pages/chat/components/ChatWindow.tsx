import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { Chat, Message, User } from "../types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ChatWindowProps {
  currentUser: string;
  chat: Chat;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, chat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [loadingRecipient, setLoadingRecipient] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(fetchedMessages);
      setLoadingMessages(false);

      // Reset unread messages count for the current user when new messages arrive
      try {
        const chatRef = doc(db, "chats", chat.id);
        await updateDoc(chatRef, {
          [`unreadMessages.${currentUser}`]: 0,
        });
        console.log("Unread messages reset successfully.");
      } catch (error) {
        console.error("Error resetting unread messages:", error);
      }

      scrollToBottom(); // Ensure the view is at the bottom
    });

    return () => unsubscribe();
  }, [chat.id, currentUser]);

  // Fetch recipient details
  useEffect(() => {
    const fetchRecipient = async () => {
      const recipientId = chat.participants.find((id) => id !== currentUser);

      if (!recipientId) {
        setRecipient(null);
        setLoadingRecipient(false);
        return;
      }

      try {
        const recipientDoc = await getDoc(doc(db, "users", recipientId.toString()));
        if (recipientDoc.exists()) {
          setRecipient({
            id: recipientId,
            ...recipientDoc.data(),
          } as User);
        } else {
          setRecipient(null);
        }
      } catch (error) {
        console.error("Error fetching recipient data:", error);
      } finally {
        setLoadingRecipient(false);
      }
    };

    fetchRecipient();
  }, [chat, currentUser]);

  // Mark messages as read when opening a chat
  useEffect(() => {
    const markAsRead = async () => {
      if (!chat.id) return;

      const chatRef = doc(db, "chats", chat.id);

      try {
        await updateDoc(chatRef, {
          [`unreadMessages.${currentUser}`]: 0,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markAsRead();
  }, [chat, currentUser]);

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    setNewMessage("");

    try {
      await addDoc(collection(db, `chats/${chat.id}/messages`), {
        senderId: currentUser,
        content: newMessage,
        timestamp: serverTimestamp(),
      });

      const chatRef = doc(db, "chats", chat.id);
      await updateDoc(chatRef, {
        lastMessage: newMessage,
        lastUpdated: serverTimestamp(),
        [`unreadMessages.${recipient?.id}`]: increment(1),
      });
    } finally {
      setIsSending(false);
      scrollToBottom(); // Scroll to bottom after sending a message
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-blue-500 text-white py-3 px-4 flex items-center justify-between">
        {loadingRecipient ? (
          <Skeleton width={200} height={24} />
        ) : (
          <div>
            <h2 className="text-lg font-semibold">{recipient?.name || "Unknown User"}</h2>
            <p className="text-sm">{recipient?.email || "No email available"}</p>
          </div>
        )}
      </div>

      {/* Messages Section */}
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4"
      >
        {loadingMessages ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={50} className="mb-2" />
            ))}
          </>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 my-2 rounded-xl shadow max-w-sm ${
                msg.senderId === currentUser
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white text-black"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-right mt-1 opacity-75">
                {msg.timestamp?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message Input Section */}
      <div className="p-4 border-t bg-white mb-20">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow border rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ height: "50px" }} // Explicit height for the input
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-6 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
            style={{ height: "50px" }} // Match the height of the input field
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
