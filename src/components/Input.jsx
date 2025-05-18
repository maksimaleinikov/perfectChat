import React, { useContext, useState } from "react";
import Img from "../img/icons/img.png";
import Attach from "../img/icons/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text && !img) return;

    try {
      // Проверяем/создаем документ чата если не существует
      const chatDocRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          messages: [],
          participants: [currentUser.uid, data.user.uid],
          createdAt: serverTimestamp(),
        });
      }

      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          (error) => {
            console.error("Upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Добавляем сообщение в массив messages
            await updateDoc(chatDocRef, {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            // Обновляем lastMessage в userChats
            await updateUserChats(text);
          }
        );
      } else {
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        await updateUserChats(text);
      }

      setText("");
      setImg(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const updateUserChats = async (messageText) => {
    const lastMessage = {
      text: messageText || "Image",
      date: serverTimestamp(),
    };

    try {
      // Обновляем userChats для текущего пользователя
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: lastMessage,
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      // Обновляем userChats для собеседника
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: lastMessage,
        [`${data.chatId}.date`]: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating userChats:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
