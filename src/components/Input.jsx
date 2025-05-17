import React, { useState } from "react";
import Attach from "../img/icons/attach.png";
import Img from "../img/icons/img.png";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useAuth();
  const { data } = useChat();

  const handleSend = async () => {
    // Не отправляем пустые сообщения
    if (!text.trim() && !img) return;

    try {
      const chatDocRef = doc(db, "chats", data.chatId);

      // Проверяем существование чата и создаем при необходимости
      const chatDoc = await getDoc(chatDocRef);
      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          messages: [],
          participants: [currentUser.uid, data.user.uid],
          createdAt: serverTimestamp(),
        });
      }

      // Обработка сообщения с изображением
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Добавляем сообщение в чат
            await updateDoc(chatDocRef, {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            // Обновляем lastMessage для текущего пользователя
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [`${data.chatId}.lastMessage`]: {
                text: text || "Image",
                date: serverTimestamp(),
              },
              [`${data.chatId}.date`]: serverTimestamp(),
            });
          }
        );
      }
      // Обработка текстового сообщения
      else {
        // Добавляем сообщение в чат
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        // Обновляем lastMessage для текущего пользователя
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${data.chatId}.lastMessage`]: {
            text,
            date: serverTimestamp(),
          },
          [`${data.chatId}.date`]: serverTimestamp(),
        });
      }

      // Очищаем поля ввода
      setText("");
      setImg(null);
    } catch (err) {
      console.error("Error sending message:", err);
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
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <img src={Attach} alt="Attach file" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="Send image" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
