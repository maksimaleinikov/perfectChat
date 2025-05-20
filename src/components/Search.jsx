import { useState } from "react";
import { db } from "../firebase";
import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [hasError, setHasError] = useState(false);

  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  const handleSearch = async () => {
    const usersRef = collection(db, "users");
    const searchQueryRef = query(
      usersRef,
      where("displayName", "==", searchQuery)
    );

    try {
      const snapshot = await getDocs(searchQueryRef);
      if (snapshot.empty) {
        setHasError(true);
        setFoundUser(null);
        return;
      }

      snapshot.forEach((doc) => {
        setFoundUser(doc.data());
      });
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.error("Search failed:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleUserSelect = async () => {
    if (!foundUser) return;

    const chatId =
      currentUser.uid > foundUser.uid
        ? currentUser.uid + foundUser.uid
        : foundUser.uid + currentUser.uid;

    try {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // create a chat if it didn't exist
        await setDoc(chatRef, { messages: [] });

        const userChatData = {
          [`${chatId}.userInfo`]: {
            uid: foundUser.uid,
            displayName: foundUser.displayName,
            photoURL: foundUser.photoURL,
          },
          [`${chatId}.date`]: serverTimestamp(),
        };

        await updateDoc(doc(db, "userChats", currentUser.uid), userChatData);
        await updateDoc(doc(db, "userChats", foundUser.uid), {
          [`${chatId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${chatId}.date`]: serverTimestamp(),
        });
      }

      setFoundUser(null);
      setSearchQuery("");

      // automatic transition to chat
      dispatch({ type: "CHANGE_USER", payload: foundUser });
    } catch (error) {
      console.error("Chat creation error:", error);
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Найти пользователя"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setHasError(false);
          }}
          onKeyDown={handleKeyPress}
        />
      </div>

      {hasError && <span>Пользователь не найден</span>}

      {foundUser && (
        <div className="userChat" onClick={handleUserSelect}>
          <img
            src={foundUser.photoURL}
            alt={foundUser.displayName}
            className="user-avatar"
          />
          <div className="userChatInfo">
            <span>{foundUser.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
