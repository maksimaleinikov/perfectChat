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
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data: chatData } = useContext(ChatContext);

  const handleSend = async () => {
    if ((!text && !img) || isSending) return; // Don't send empty messages and redial block

    try {
      if (img) {
        await uploadImageAndSendMessage();
      } else {
        await sendTextMessage();
      }

      await updateLastMessageInfo(text || "Image");
      resetInputFields();
    } catch (error) {
      console.error("Message sending error:", error);
    }
  };

  const uploadImageAndSendMessage = async () => {
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, img);

    await uploadTask;

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    await sendMessage(text, downloadURL);
  };

  const sendTextMessage = async () => {
    await sendMessage(text);
  };

  const sendMessage = async (messageText, imageUrl = null) => {
    const message = {
      id: uuid(),
      text: messageText,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      ...(imageUrl && { img: imageUrl }),
    };

    await updateDoc(doc(db, "chats", chatData.chatId), {
      messages: arrayUnion(message),
    });
  };

  const updateLastMessageInfo = async (messageText) => {
    const lastMessage = {
      text: messageText,
      date: serverTimestamp(),
    };

    const updatePayload = {
      [`${chatData.chatId}.lastMessage`]: lastMessage,
      [`${chatData.chatId}.date`]: serverTimestamp(),
    };

    // Update both users' records in parallel
    await Promise.all([
      updateDoc(doc(db, "userChats", currentUser.uid), updatePayload),
      updateDoc(doc(db, "userChats", chatData.user.uid), updatePayload),
    ]);
  };

  const resetInputFields = () => {
    setText("");
    setImg(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
        <img src={Attach} alt="Attach file" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => e.target.files[0] && setImg(e.target.files[0])}
          accept="image/*"
        />
        <label htmlFor="file">
          <img src={Img} alt="Upload image" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
