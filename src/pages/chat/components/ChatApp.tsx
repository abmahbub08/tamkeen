import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import StartChatModal from "./StartChatModal";
import { Chat } from "../types";

const ChatApp: React.FC<{
  currentUser: string;
  selectedChatId: string | null;
  chat: Chat | null;
}> = ({ currentUser, selectedChatId, chat }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Sync `chat` prop with `selectedChat` state
  useEffect(() => {
    if (chat) {
      setSelectedChat(chat);
    }
  }, [chat]);

  // Callback to handle chat selection from ChatList
  const handleChatSelection = (chat: Chat) => {
    console.log("Received selected chat:", chat); // Log or process the received chat
    setSelectedChat(chat); // Update state
  };

  // Callback to handle new chat creation
  const handleModalChatCreated = (chat: Chat) => {
    console.log("Received new chat from modal:", chat); // Log or process the received chat
    setSelectedChat(chat); // Open the new chat
  };

  return (
    <div className="flex h-screen mt-20">
      {/* Chat List */}
      <div className="w-1/3 bg-gray-100 p-4 border-r">
        <ChatList
          currentUser={currentUser}
          selectedChatId={selectedChat?.id || selectedChatId || null} // Pass selected chat ID or default to null
          onSelectChat={handleChatSelection} // Pass callback for selection
          onStartNewChat={() => setModalOpen(true)} // Open modal on click
        />
      </div>

      {/* Chat Window */}
      <div className="w-2/3 bg-white">
        {selectedChat ? (
          <ChatWindow currentUser={currentUser} chat={selectedChat} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Select or start a chat</p>
          </div>
        )}
      </div>

      {/* Start Chat Modal */}
      {isModalOpen && (
        <StartChatModal
          currentUser={currentUser}
          onClose={() => setModalOpen(false)} // Close modal
          onChatCreated={handleModalChatCreated} // Pass callback for new chat
        />
      )}
    </div>
  );
};

export default ChatApp;
