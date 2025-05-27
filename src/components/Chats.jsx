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
    const subscribeToChats = () => {
      const unsubscribeFromChats = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (docSnapshot) => {
          setChats(docSnapshot.data());
        }
      );

      return () => {
        unsubscribeFromChats();
      };
    };

    currentUser.uid && subscribeToChats();
  }, [currentUser.uid]);

  // Handles chat selection and updates context
  const handleSelect = (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date?.seconds - a[1].date?.seconds) //sorted chats in order by timestamp (newest chats first)
        ?.map(([chatId, chatData]) => {
          // Skip rendering if no user photo
          if (!chatData?.userInfo?.photoURL) return null;

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
