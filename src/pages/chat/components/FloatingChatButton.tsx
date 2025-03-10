import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const FloatingChatButton: React.FC = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = Boolean(Cookies.get("user"));

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate("/chat"); // Navigate to the chat page
    } else {
      alert("You need to be logged in to access the chat!");
    }
  };

  if (!isAuthenticated) {
    // Don't render the button if the user is not authenticated
    return null;
  }

  return (
    <button
      onClick={handleNavigate}
      className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
    >
      Chat
    </button>
  );
};

export default FloatingChatButton;
