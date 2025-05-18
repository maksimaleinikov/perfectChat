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
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  const handleSearch = async () => {
    setErr(false);
    setUser(null);

    if (!username.trim()) {
      setErr(true);
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username.trim())
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUser({
          ...userDoc.data(),
          id: userDoc.id,
        });
      } else {
        setErr(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!user || !currentUser) return;

    try {
      const combinedId =
        currentUser.uid > user.id
          ? currentUser.uid + "_" + user.id
          : user.id + "_" + currentUser.uid;

      const chatDocRef = doc(db, "chats", combinedId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          messages: [],
          participants: [currentUser.uid, user.id],
          createdAt: serverTimestamp(),
        });

        // Обновляем userChats для текущего пользователя
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: {
            userInfo: {
              uid: user.id,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            date: serverTimestamp(),
            lastMessage: {
              text: "Chat started",
              date: serverTimestamp(),
            },
          },
        });

        // Обновляем userChats для собеседника
        await updateDoc(doc(db, "userChats", user.id), {
          [combinedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            date: serverTimestamp(),
            lastMessage: {
              text: "Chat started",
              date: serverTimestamp(),
            },
          },
        });
      }

      dispatch({
        type: "CHANGE_USER",
        payload: user,
      });
    } catch (err) {
      console.error("Error in handleSelect:", err);
    } finally {
      setUser(null);
      setUsername("");
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt={user.displayName} />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
