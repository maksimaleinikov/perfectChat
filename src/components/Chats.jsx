import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState({}); // Используем объект вместо массива

  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data() || {}); // Добавляем fallback на случай отсутствия данных
      });

      return () => unsub();
    };
    currentUser.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (userInfo) => {
    if (!userInfo) return;
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };
  console.log(Object.entries(chats));
  return (
    <div className="chats">
      {Object.entries(chats)?.map(([chatId, chatData]) => {
        if (!chatData?.userInfo) return null;

        return (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(chatData.userInfo)}
          >
            <img
              src={chatData.userInfo.photoURL || "default-avatar.png"}
              alt={chatData.userInfo.displayName || "User"}
            />
            <div className="userChatInfo">
              <span>{chatData.userInfo.displayName || "Unknown"}</span>
              <p>{chatData.lastMessage?.text || ""}</p>{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
