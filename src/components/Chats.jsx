import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date?.seconds - a[1].date?.seconds)
        ?.map(([chatId, chatData]) => {
          if (!chatData?.userInfo?.photoURL) return null; // Пропускаем если нет фото

          return (
            <div
              className="userChat"
              key={chatId}
              onClick={() => handleSelect(chatData.userInfo)}
            >
              <img
                src={chatData.userInfo.photoURL}
                alt={chatData.userInfo.displayName || "User"}
              />
              <div className="userChatInfo">
                <span>{chatData.userInfo.displayName || "Unknown"}</span>
                <p>{chatData.lastMessage?.text || ""}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
