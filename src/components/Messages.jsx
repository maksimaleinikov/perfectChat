import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useChat } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChat();

  useEffect(() => {
    if (!data?.chatId) return; // Добавляем проверку на chatId

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        // Безопасное получение messages с fallback на пустой массив
        setMessages(doc.data().messages || []);
      } else {
        setMessages([]); // Если чата нет - очищаем сообщения
      }
    });

    return () => unSub();
  }, [data?.chatId]); // Зависимость от data.chatId
  console.log(messages);
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
};

export default Messages;
