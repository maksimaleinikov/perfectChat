import { createContext, useContext, useReducer } from "react";
import { useAuth } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const manageChatState = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };

  const [chatState, dispatchChatAction] = useReducer(
    manageChatState,
    INITIAL_STATE
  );

  return (
    <ChatContext.Provider
      value={{
        data: chatState,
        dispatch: dispatchChatAction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

//Custom hook for context

export const useChat = () => {
  return useContext(ChatContext);
};
