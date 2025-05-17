import React from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export const Message = ({ message }) => {
  console.log(message);
  const { currentUser } = useAuth();
  const { data } = useChat();

  return (
    <div className="message owner">
      {/* <div className="messageInfo">
        <img
          src=
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>hello</p>
        <img
          src="https://images.pexels.com/photos/9024330/pexels-photo-9024330.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
      </div> */}
    </div>
  );
};

export default Message;
