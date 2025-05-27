import React from "react";
import Camera from "../img/icons/cam.png";
import Add from "../img/icons/addImage.png";
import More from "../img/icons/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { data } = useChat();

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Camera} alt="Camera icon" />
          <img src={Add} alt="Add media icon" />
          <img src={More} alt="More options" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
