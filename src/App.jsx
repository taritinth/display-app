import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  onChildAdded,
  update,
} from "firebase/database";

import { useEffect, useRef, useState } from "react";

import { useSnackbar } from "notistack";
import { useDebounce } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "framer-motion";

const firebaseConfig = {
  apiKey: "AIzaSyCjXVFc6h-s1UJ5DyUxlmnF3moIG9K6aAc",
  authDomain: "thainads-speed-dating.firebaseapp.com",
  databaseURL:
    "https://thainads-speed-dating-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thainads-speed-dating",
  storageBucket: "thainads-speed-dating.appspot.com",
  messagingSenderId: "753163570473",
  appId: "1:753163570473:web:132c525e1875d70f3a7b38",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const getRankingIconSize = (index) => {
  switch (index) {
    case 0:
      return "w-14";
    case 1:
      return "w-12";
    case 2:
      return "w-10";
    default:
      return "w-10";
  }
};
const getRankingIcon = (index) => {
  switch (index) {
    case 0:
      return "rank/nads.png";
    case 1:
      return "rank/gold.png";
    case 2:
      return "rank/silver.png";
    default:
      return "rank/bronze.png";
  }
};

const getRankingBgColor = (index) => {
  switch (index) {
    case 0:
      return "bg-violet-500";
    case 1:
      return "bg-amber-300";
    case 2:
      return "bg-zinc-200";
    default:
      return "bg-neutral-500";
  }
};

const getRankingLabelColor = (index) => {
  switch (index) {
    case 0:
      return "text-white";
    case 1:
      return "text-black";
    case 2:
      return "text-black";
    default:
      return "text-white";
  }
};

function App() {
  const { enqueueSnackbar } = useSnackbar();

  // const [connections, setConnections] = useState([]);
  const [users, setUsers] = useState({});
  const debouncedUsers = useDebounce(users, 500);
  // const [receivedConnections, setReceivedConnections] = useState({});
  const receivedConnections = useRef({});

  function getUsers() {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val() || {};
      setUsers(users);
    });
  }

  const sortedUsersByRanking = Object.values(debouncedUsers)
    .filter((user) => Object.keys(user?.connections || {}).length > 0)
    .sort((a, b) => {
      // Sort by number of connections (descending)
      const connectionDiff =
        Object.keys(b.connections).length - Object.keys(a.connections).length;

      if (connectionDiff !== 0) {
        return connectionDiff;
      }

      // If number of connections is the same, sort by last active (ascending)
      return a.lastActive - b.lastActive;
    });

  function listenForNewConnections() {
    const connectionsRef = ref(db, "connections");

    onChildAdded(connectionsRef, (snapshot) => {
      const newConnection = snapshot.val() || {};

      const user1 = users[newConnection.user1];
      const user2 = users[newConnection.user2];

      // Check if the connection is new and has not been seen
      if (
        !newConnection?.seen &&
        !receivedConnections.current[newConnection?.id]
      ) {
        // Mark the connection as received
        receivedConnections.current[newConnection?.id] = true;

        // Show a new connection notification
        enqueueSnackbar("", {
          variant: "newConnection",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          user1,
          user2,
        });

        // Mark the connection as seen
        update(ref(db, `connections/${newConnection.id}`), {
          seen: true,
        });
      }
    });
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Get clientId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("clientId");

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      listenForNewConnections();
    }
  }, [users]);

  return (
    <>
      <iframe
        src={
          import.meta.env.VITE_GRAPH_DISPLAY_URL +
          (clientId ? `?clientId=${clientId}` : "")
        }
        title="Vite React Example"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          border: 0,
          overflow: "hidden",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
      <div className="fixed top-0 left-0 p-4 z-[2] max-w-[400px] w-full">
        <AnimatePresence>
          {sortedUsersByRanking.slice(0, 5).map((user, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.25 }}
              key={user.username}
              className={`relative flex items-center justify-between my-3 h-[64px] px-3 ${getRankingLabelColor(
                index
              )} rounded-xl overflow-hidden`}
            >
              <div
                className={`absolute -z-10 top-0 left-0 w-full h-full ${getRankingBgColor(
                  index
                )}`}
              ></div>
              <div className={`flex items-center min-w-0`}>
                <div className="relative w-[56px] flex justify-center items-center mr-2 shrink-0">
                  <img
                    src={getRankingIcon(index)}
                    alt="bronze"
                    className={`z-[1] ${getRankingIconSize(index)}`}
                  />
                  <span
                    className={`absolute text-[24px] text-white font-bold z-[2]`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform:
                        index < 3
                          ? "translate(-50%, -60%)"
                          : "translate(-50%, -50%)",
                    }}
                  >
                    {index + 1}
                  </span>
                </div>
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <strong className="whitespace-nowrap text-ellipsis overflow-hidden text-[24px]">
                  {user.displayName}
                </strong>
              </div>
              <div className="text-lg font-semibold min-w-10">
                +{Object.keys(user.connections).length}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
