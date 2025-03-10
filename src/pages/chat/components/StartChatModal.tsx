import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface StartChatModalProps {
  currentUser: string;
  onClose: () => void;
  onChatCreated: (chat: any) => void;
}

const StartChatModal: React.FC<StartChatModalProps> = ({
  currentUser,
  onClose,
  onChatCreated,
}) => {
  const [referrers, setReferrers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReferrers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.tamkeen.center/api/pyramid/referral-tree/${currentUser}`
        );
        const data = await response.json();
        setReferrers(data.referral_tree.flatMap((level: any) => level.referrals));
      } catch (error) {
        console.error("Error fetching referrers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrers();
  }, [currentUser]);

  const startChat = async (userId: string) => {
    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser)
      );
      const existingChats = await getDocs(chatQuery);

      const existingChat = existingChats.docs.find((doc) =>
        doc.data().participants.includes(userId)
      );

      if (existingChat) {
        onChatCreated({ id: existingChat.id, ...existingChat.data() });
        onClose();
        return;
      }

      const chatRef = await addDoc(collection(db, "chats"), {
        participants: [currentUser, userId],
        unreadMessages: { [currentUser]: 0, [userId]: 0 },
        lastMessage: "",
        lastUpdated: new Date(),
      });

      onChatCreated({ id: chatRef.id, participants: [currentUser, userId] });
      onClose();
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Start a New Chat</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <ul>
            {referrers.map((ref) => (
              <li key={ref.id} className="p-2 bg-gray-100 rounded mb-2">
                <span>{ref.user.name} ({ref.user.email})</span>
                <button
                  onClick={() => startChat(ref.user.id)}
                  className="btn btn-primary ml-4"
                >
                  Start Chat
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="btn btn-secondary mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default StartChatModal;
