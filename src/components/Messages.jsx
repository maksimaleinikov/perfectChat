import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useChat } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data: chatData } = useChat();

  useEffect(() => {
    const unsubscribeFromMessages = onSnapshot(
      doc(db, "chats", chatData.chatId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data().messages);
        }
      }
    );
    // Cleanup f to unsubscribe
    return () => unsubscribeFromMessages();
  }, [chatData.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
};

export default Messages;
