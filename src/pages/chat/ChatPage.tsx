import React from "react";
import { useLocation } from "react-router-dom";
import ChatApp from "../chat/components/ChatApp";
import Cookies from "js-cookie";

const ChatPage: React.FC = () => {
    const location = useLocation();
    const { chat, userId } = location.state || {};
    const currentUser = Cookies.get("user");
    const mydata = JSON.parse(currentUser!); // Parse user details from storage

    return <>
        <ChatApp
            currentUser={mydata.id}
            selectedChatId={chat?.id || null} // Pass chat ID or null if chat is not defined
            chat={chat || null} // Pass chat or null
        />
        </>

        ;
};

export default ChatPage;
