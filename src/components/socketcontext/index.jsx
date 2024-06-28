import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initDB, getAllSongs, saveSongToDB } from "../../indexeddb/index";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await initDB();
        const newSocket = io("https://ppusher.onrender.com");

        newSocket.on("connect", () => {
          console.log("Connected to server, socket ID:", newSocket.id);
        });

        newSocket.on("receiveSong", ({ senderId, songData }) => {
          console.log(`Received song from ${senderId}: ${songData.fileName}`);
          saveSongToDB(songData);
          toast.info(`Received song: ${songData.fileName}`, {
            position: "top-right",
            autoClose: 3000, // Close the toast after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });

        newSocket.on("searchResults", (resultsFromUsers) => {
          console.log("Received search results:", resultsFromUsers);
          if (resultsFromUsers.length > 0) {
            setSearchResults((prev) => [
              ...prev,
              ...resultsFromUsers.map((val) => ({
                fileName: val.fileName,
                dataURL: val.dataURL,
              })),
            ]);
          } else {
            console.log("No songs found.");
          }
        });

        newSocket.on(
          "performSearch",
          async ({ searchTerm, requesterId }) => {
            try {
              const allSongs = await getAllSongs();
              const specificSearchTerm = searchTerm.trim();
              const regex = new RegExp(
                `${specificSearchTerm}(_firsthalf|_secondhalf)`
              );

              const filteredSongs = allSongs.filter((song) =>
                regex.test(song.fileName)
              );
              console.log("Filtered songs:", filteredSongs);
              newSocket.emit("searchResultsFromUser", {
                requesterId: requesterId,
                searchResults: filteredSongs,
              });
            } catch (error) {
              console.error("Error searching songs:", error);
            }
          }
        );

        newSocket.on("error", (error) => {
          console.error("Socket error:", error);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to initialize IndexedDB or Socket:", error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, searchResults, setSearchResults }}>
      {children}
      <ToastContainer /> {/* This is where toast notifications will be rendered */}
    </SocketContext.Provider>
  );
};
